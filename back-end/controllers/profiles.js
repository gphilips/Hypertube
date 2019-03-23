const mongoose = require("mongoose");
const User = require("../models/User");
const Comment = require("../models/Comment");
const { generateToken } = require("../utils/token");
const { FormEditValidator } = require("../utils/inputsValidator");
const error = (res, param, msg) =>
  res.send({ success: false, errors: [{ param, msg }] });

exports.getAllUsers = async (req, res) => {
  let { page } = req.query;
  if (!page) return error(res, "page", "The profile page is missing.");

  page = parseInt(page);
  const limit = 2;
  const nbUsers = await User.countDocuments({});
  const nbPageMax = Math.ceil(nbUsers / limit);
  if (page === nbPageMax) {
    return res.send({
      success: true,
      errors: [],
      usersProfile: {
        profiles: [],
        hasMoreProfile: false,
        nextProfilePage: page
      }
    });
  } else {
    const skip = (page - 1) * limit;
    User.findOne({}, "-password -email", { skip, limit }, (err, profiles) => {
      if (err || !profiles)
        return error(res, "profiles", "There is no profiles.");
      else {
        return res.send({
          success: true,
          errors: [],
          usersProfile: {
            profiles: [...profiles],
            hasMoreProfile: true,
            nextProfilePage: page++
          }
        });
      }
    });
  }
};

exports.getUser = (req, res) => {
  const { username } = req.params;
  if (!username) return error(res, "username", "The username is missing.");

  if (!/^[a-zA-Z0-9._-]+$/i.test(username.trim()))
    return error(
      res,
      "username",
      "The username must contain alphanumeric characters."
    );

  User.findOne(
    { username },
    "-password -resetPwdToken -fortytwoId -googleId -facebookId",
    (err, user) => {
      if (err || !user) return error(res, "user", `${username} doesn't exist`);
      else return res.send({ success: true, errors: [], user });
    }
  );
};

exports.updateUserById = async (req, res) => {
  const { username, firstname, lastname, email, lang, avatar } = req.body;
  const { id } = req.params;

  if (avatar === "noImage")
    return error(res, "avatar", "This avatar is not an image !");

  if (!id) return error(res, "id", "The id is missing.");
  const errors = await FormEditValidator(req);
  if (errors.length) return res.send({ success: false, errors });
  else {
    const objId = mongoose.Types.ObjectId(id);
    User.findByIdAndUpdate(
      objId,
      { username, firstname, lastname, email, lang, avatar },
      { new: true, upsert: true },
      (err, user) => {
        if (err) return error(res, "update", "It's already used.");

        if (!user) return error(res, "id", "The user doesn't exist.");
        else {
          let user = { _id: id, username, email };
          const token = generateToken(user, "local");
          return res.send({
            success: true,
            errors: [],
            user: { ...req.body },
            token
          });
        }
      }
    );
  }
};

exports.deleteUserById = (req, res) => {
  const { id } = req.params;
  if (!id) return error(res, "id", "The id is missing.");

  const objId = mongoose.Types.ObjectId(id.trim());
  User.findByIdAndRemove(objId, (err, user) => {
    if (err || !user) return error(res, "id", "The user doesn't exist.");
    else {
      Comment.deleteMany({ userId: objId }, (err, comments) => {
        return res.send({ success: true, errors: [] });
      });
    }
  });
};
