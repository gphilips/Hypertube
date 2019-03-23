const mongoose = require("mongoose");
const torrentStream = require("torrent-stream");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const mime = require("mime-types");
const path = require("path");
const fs = require("fs");
const { findIndex } = require("lodash");
const Movie = require("../models/Movie");
const User = require("../models/User");
const options = require("../config/torrent");

ffmpeg.setFfmpegPath(ffmpegPath);

const error = (param, msg) => {};

let file = "";
let currentStream = null;

const streamFile = (res, file, start, end, mimetype) => {
  const validExt = ["video/mp4", "video/ogg", "video/ogv", "video/webm"];
  if (currentStream) {
    currentStream.emit("end");
  }
  currentStream = res;
  if (validExt.includes(mimetype)) {
    let stream = file.createReadStream({
      start: start,
      end: end
    });
    stream.pipe(res);
  } else {
    let torrent = file.createReadStream();
    ffmpeg(torrent)
      .on("start", () => console.log("Conversion started..."))
      .on("error", err => {})
      .format("webm")
      .audioBitrate(128)
      .audioCodec("libvorbis")
      .videoBitrate(1024)
      .videoCodec("libvpx")
      .stream()
      .pipe(res);
  }
};

const readTorrentDownloading = (file, range, res, req) => {
  let mimetype = mime.lookup(file.name);
  if (!mimetype) {
    return downloadTorrent(req, range, res);
  } else {
    let isVideo = mimetype.split("/")[0];
    const validExt = [".mp4", ".ogg", ".ogv", ".webm"];
    const extension = path.extname(file.name);
    const mimeType = extension.replace(".", "");
    const contentType =
      "video/" + !validExt.includes(extension) ? "webm" : mimeType;
    if (isVideo === "video") {
      let total = file.length;
      let start = 0;
      let end = total - 1;
      if (range) {
        let parts = range.replace(/bytes=/, "").split("-");
        let newStart = parts[0];
        let newEnd = parts[1];
        start = parseInt(newStart, 10);
        end = newEnd ? parseInt(newEnd, 10) : total - 1;
        let chunksize = end - start + 1;
        if (validExt.includes(extension)) {
          ``;
          res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${total}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": contentType
          });
        } else {
          res.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/*",
            "Content-Type": "video/webm"
          });
        }
        streamFile(res, file, start, end, mimetype);
      } else {
        res.writeHead(200, {
          "Content-Length": total,
          "Content-Type": contentType
        });
        streamFile(res, file, start, end, mimetype);
      }
    }
  }
};

const setTorrentSeenAt = ({ hash, userId, imdbId }) => {
  return new Promise((resolve, reject) => {
    const seenAt = Date.now();
    Movie.findOneAndUpdate(
      { hash },
      { seenAt },
      { new: true, upsert: true },
      (err, movie) => {
        if (err) reject("We cannot update the movie.");
        if (!movie) reject("The movie doesn't exist.");
        else {
          const objId = mongoose.Types.ObjectId(userId);
          User.findById(objId, "movies", (err, user) => {
            if (err) reject("We cannot search for the user.");
            if (!user) reject("The user doesn't exist.");
            else {
              const { movies } = user;
              const pos = findIndex(movies, movie => movie.hash === hash);
              if (pos >= 0) {
                movies[pos].seenAt = seenAt;
                movies[pos].imdbId = imdbId;
              } else movies.push({ hash, seenAt, imdbId });
              user.movies = movies;
              user.save(err => {
                if (err) reject("We cannot save the user.");
                else resolve();
              });
            }
          });
        }
      }
    );
  });
};

const saveTorrent = movieAttributs => {
  return new Promise((resolve, reject) => {
    const { hash, imdbId, userId, torrentPath } = movieAttributs;
    if (!hash || !imdbId || !userId || !torrentPath)
      return reject("There is something missing with the movie data");
    else {
      Movie.find({ hash }, (err, movieExist) => {
        if (err) return reject("We cannot search for the movie.");
        if (movieExist && movieExist[0]) {
          Movie.findOneAndUpdate({ hash }, { isDownloading: true })
            .then(() => resolve())
            .catch(err => reject(err));
        } else {
          const movie = new Movie({
            ...movieAttributs,
            isDownloading: true,
            isComplete: false
          });
          movie.save(err => {
            if (err) return reject("We cannot save the movie.");
            else resolve();
          });
        }
      });
    }
  });
};

const downloadTorrent = ({ imdbId, hash, userId }, range, res) => {
  const validExt = [".mp4", ".ogg", ".ogv", ".webm"];
  let torrentPath = `${options.path}/${hash}`;
  let title;
  let fileSize;
  const engine = torrentStream(hash, { ...options, path: torrentPath });
  return new Promise((resolve, reject) => {
    engine.on("ready", () => {
      file = engine.files.reduce((a, b) => (a.length > b.length ? a : b));
      torrentPath = `${torrentPath}/${file.path}`;
      title = file.name;
      fileSize = file.length;
      extension = path.extname(file.name);
      const isVideo = mime.lookup(file.name).split("/")[0];
      if (isVideo !== "video") return reject("There is no video");
      file.select();
      saveTorrent({ hash, imdbId, userId, torrentPath });
      if (!validExt.includes(extension)) {
        let torrent = file.createReadStream();
        ffmpeg(torrent)
          .on("start", () => console.log("Conversion started..."))
          .on("error", err => {})
          .format("webm")
          .audioBitrate(128)
          .audioCodec("libvorbis")
          .videoBitrate(1024)
          .videoCodec("libvpx")
          .stream()
          .pipe(res);
      } else {
        readTorrentDownloading(file, range, res);
      }
    });

    engine.on("idle", async () => {
      const displayTitle = title.slice(0, title.length > 35 ? -25 : -4);
      console.log(`${displayTitle}... has been downloaded`);
      Movie.findOneAndUpdate(
        { hash },
        { $set: { isDownloading: false, isComplete: true } },
        (err, movie) => {
          if (err) {
          }
        }
      );
    });
    engine.once("destroyed", () => engine.removeAllListeners());
  });
};

const streamTorrent = (torrentPath, res, pos, mimeType) => {
  const validExt = ["mp4", "ogg", "ogv", "webm"];
  if (currentStream) {
    currentStream.emit("end");
  }
  currentStream = res;
  if (validExt.includes(mimeType)) {
    let stream;
    if (pos) {
      stream = fs.createReadStream(torrentPath, {
        start: pos.start,
        end: pos.end
      });
    }
    else
      stream = fs.createReadStream(torrentPath);
    stream.pipe(res);
  } else {
    let torrent = fs.createReadStream(torrentPath);
    ffmpeg(torrent)
      .on("start", () => console.log("Conversion started..."))
      .on("error", err => {})
      .format("webm")
      .audioBitrate(128)
      .audioCodec("libvorbis")
      .videoBitrate(1024)
      .videoCodec("libvpx")
      .stream()
      .pipe(res);
  }
};

const readTorrent = (torrentPath, range, res) => {
  const validExt = [".mp4", ".ogg", ".ogv", ".webm"];
  if (!fs.existsSync(torrentPath))
    return error("readTorrent", "The file doesn't exist");
  const stat = fs.statSync(torrentPath);
  if (!stat) return error("readTorrent", "The torrent path is incorrect");
  const fileSize = stat.size;
  const extension = path.extname(torrentPath);
  const mimeType = extension.replace(".", "");
  const contentType =
    "video/" + !validExt.includes(extension) ? "webm" : mimeType;
  if (range) {
    const pos = range.replace(/bytes=/, "").split("-");
    const start = pos[0] ? parseInt(pos[0], 10) : 0;
    const end = pos[1] ? parseInt(pos[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    if (validExt.includes(extension)) {
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": contentType
      };
      res.writeHead(206, head);
    } else {
      res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/*",
        "Content-Type": "video/webm"
      });
    }
    streamTorrent(torrentPath, res, { start, end }, mimeType);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": contentType
    };
    res.writeHead(200, head);
    streamTorrent(torrentPath, res, null, mimeType);
  }
};

exports.getTorrent = (req, res) => {
  const { range } = req.headers;
  const { hash } = req.params;
  if (!hash) return error("getTorrent", "There is no hash for this torrent");
  else {
    Movie.findOne({ hash }, (err, movie) => {
      if (err) return error("getTorrent", "We cannot search for a movie");
      else if (!movie || (movie && !movie.isDownloading && !movie.isComplete)) {
        return downloadTorrent(req.params, range, res);
      } else if (movie && movie.isDownloading && !movie.isComplete) {
        return setTorrentSeenAt(req.params)
          .then(() => readTorrentDownloading(file, range, res, req.params))
          .catch(err => {});
      } else {
        return setTorrentSeenAt(req.params)
          .then(() => readTorrent(movie.torrentPath, range, res))
          .catch(err => {});
      }
    });
  }
};

exports.cleanUnWatchedTorrent = () => {
  console.log("Checking if there are unwatched torrents...");
  const oneMonth = 1000 * 60 * 60 * 24 * 30;
  const oneMonthBefore = Date.now() - oneMonth;
  const promisesMovie = [];
  Movie.find({ seenAt: { $lte: oneMonthBefore } }, (err, movies) => {
    if (!err) {
          movies.forEach(async movie => {
      const { hash, torrentPath } = movie;
      if (fs.existsSync(torrentPath)) {
        fs.unlinkSync(torrentPath);
        console.log(`${torrentPath} has been deleted.`);
      }
      promisesMovie.push(Movie.deleteOne({ hash }));
    });
    Promise.all(promisesMovie).then(() => console.log("Done."));
    }

  });
};
