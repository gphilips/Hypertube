const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");
const User = require("../models/User");
var mmm = require("mmmagic"),
  Magic = mmm.Magic;

require("dotenv").config({ path: path.join(__dirname, "/config/.env") });

const storage = multer.diskStorage({
  destination: path.join(__dirname, `../public/uploads/tmp`),
  filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({
  storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    cb(
      null,
      file.mimetype === "image/png" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg"
    );
  }
}).single("avatar");

const error = (res, param, msg) =>
  res.send({ success: false, errors: [{ param, msg }] });

exports.uploadAvatar = (req, res) => {
  upload(req, res, async err => {
    if (!req.file) return error(res, "avatar", "Image is missing.");
    if (err) return error(res, "avatar", "The image is too large.");

    // const { id } = req.body;
    const { originalname } = req.file;
    // const newFileName = id + path.extname(originalname);

    const newFileName = Date.now() + path.extname(originalname);
    const tmpPath = path.join(
      __dirname,
      `../public/uploads/tmp/${originalname}`
    );
    const avatarPath = path.join(
      __dirname,
      `../public/uploads/avatar/${newFileName}`
    );

    if (fs.existsSync(tmpPath)) {
      var magic = new Magic(mmm.MAGIC_MIME_TYPE);
      magic.detectFile(req.file.path, function(err, result) {
        if (result !== "image/jpeg" && result !== "image/png") {
          fs.unlink(tmpPath, function(err) {});
          return res.send({
            success: false,
            avatar: "noImage"
          });
        } else {
          Jimp.read(tmpPath, (err, img) => {
            if (err)
              return error(
                res,
                "avatar",
                "Something went wrong with your avatar."
              );
            img.resize(150, Jimp.AUTO).write(avatarPath);
            fs.unlinkSync(tmpPath);
            const avatar = `${
              process.env.APIURL
            }/uploads/avatar/${newFileName}`;
            return res.send({
              success: true,
              avatar,
              error: []
            });
          });
        }
      });
    }
  });
};
