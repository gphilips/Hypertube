var MainPath = require("path"),
  Transcoder = require("stream-transcoder");
const fs = require("fs");
const OS = require("opensubtitles-api");
const User = require("../models/User");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "/config/.env") });
const OpenSubtitles = new OS({
  // useragent: "TemporaryUserAgent"
  useragent: "cnairi42"
});

let base64 = require("file-base64");
var srt2vtt = require("srt-to-vtt");
const axios = require("axios");

function asyncBase64(filePath) {
  return new Promise(function(resolve, reject) {
    base64.encode(filePath, function(err, fileBase64) {
      if (err) reject(err);
      resolve(fileBase64);
    });
  });
}

exports.getDefaultLanguage = (req, res) => {
  if (req.body.userId) {
    let { userId } = req.body;
    User.findOne({ _id: userId }, (err, user) => {
      if (user) {
        let defaultLanguage = user.lang;
        if (defaultLanguage) {
          return res.json({
            success: true,
            defaultLanguage,
            subtitlesFr: false,
            subtitlesFrBase64: "",
            subtitlesEn: false,
            subtitlesEnBase64: ""
          });
        }
      } else {
        return res.json({ error: "User does not exists !" });
      }
    });
  }
};

exports.getSubtitles = (req, res) => {
  if (req.params.language && req.params.imdbMovieId) {
    let { language, imdbMovieId } = req.params;

    let subtitlesFr = false;
    let subtitlesEn = false;
    let subtitlesEnBase64 = "";
    let subtitlesFrBase64 = "";
    let subtitlesPath = `${process.env.SUBTITLESPATH}/${imdbMovieId}`;

    if (!fs.existsSync(process.env.HYPERTUBEPATH)) {
      fs.mkdirSync(process.env.HYPERTUBEPATH);
    }
    if (!fs.existsSync(process.env.SUBTITLESPATH)) {
      fs.mkdirSync(process.env.SUBTITLESPATH);
    }
    if (!fs.existsSync(subtitlesPath)) {
      fs.mkdirSync(subtitlesPath);
    }

    let srtFilePath = subtitlesPath + `/subtitles.${language}.srt`;
    let vttFilePath = subtitlesPath + `/subtitles.${language}.vtt`;
    let writerSrtFile = fs.createWriteStream(srtFilePath);
    let writerVttFile = fs.createWriteStream(vttFilePath);

    OpenSubtitles.search({
      sublanguageid: "eng, fre",
      imdbid: imdbMovieId,
      extensions: ["srt", "vtt"]
    })
      .then(subtitles => {
        if (subtitles.en && subtitles.en.url && language === "en") {
          axios({
            method: "get",
            url: subtitles.en.url,
            responseType: "stream"
          })
            .then(response => {
              response.data.pipe(writerSrtFile);
              writerSrtFile.on("finish", async function() {
                let srtToVttFile = await fs
                  .createReadStream(srtFilePath)
                  .pipe(srt2vtt())
                  .pipe(writerVttFile);
                srtToVttFile.on("finish", async function() {
                  subtitlesEn = true;
                  subtitlesEnBase64 = await asyncBase64(
                    subtitlesPath + "/subtitles.en.vtt"
                  );
                  return res.json({
                    success: true,
                    subtitlesEn,
                    subtitlesEnBase64
                  });
                });
              });
            })
            .catch(err => {});
        } else if (subtitles.fr && subtitles.fr.url && language === "fr") {
          axios({
            method: "get",
            url: subtitles.fr.url,
            responseType: "stream"
          })
            .then(async response => {
              await response.data.pipe(writerSrtFile);
              writerSrtFile.on("finish", async function() {
                let srtToVttFile = await fs
                  .createReadStream(srtFilePath)
                  .pipe(srt2vtt())
                  .pipe(writerVttFile);
                srtToVttFile.on("finish", async function() {
                  subtitlesFr = true;
                  subtitlesFrBase64 = await asyncBase64(
                    subtitlesPath + "/subtitles.fr.vtt"
                  );
                  return res.json({
                    success: true,
                    subtitlesFr,
                    subtitlesFrBase64
                  });
                });
              });
            })
            .catch(err => {});
        } else {
          return res.json({
            success: false
          });
        }
      })
      .catch(err => {});
  }
};
