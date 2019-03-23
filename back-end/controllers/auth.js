const User = require("../models/User");
const {
  signUpValidator,
  forgotValidator,
  verifyAccessResetValidator,
  resetPwdValidator
} = require("../utils/inputsValidator");
const {
  sendSignUpMail,
  sendForgotMail,
  sendResetMail
} = require("../utils/sendMail");
const { generateRandomToken } = require("../utils/token");

const error = (res, param, msg) =>
  res.send({ success: false, errors: [{ param, msg }] });

exports.signUpUser = async (req, res) => {
  const { email, password, username, firstname, lastname, avatar } = req.body;

  const errors = await signUpValidator(req);
  if (avatar === "noImage")
    return error(res, "avatar", "This avatar is not an image !");
  if (errors.length) return res.send({ success: false, errors });

  const user = new User({
    email,
    password,
    username,
    firstname,
    lastname,
    avatar
  });

  User.findOne({ username }, (err, userExist) => {
    if (err || userExist)
      return error(res, "username", "This username is already used.");
    else {
      User.findOne({ email }, (err, userExist) => {
        if (err || userExist)
          return error(res, "email", "This email is already used.");
        else {
          user.save(err => {
            if (err)
              return error(res, "register", "We cannot register your account.");
            else {
              sendSignUpMail(email, username);
              return res.send({ success: true, errors: [], id: user.id });
            }
          });
        }
      });
    }
  });
};

exports.forgotPwdUser = async (req, res) => {
  const { email } = req.body;
  const HOUR = 3600000;
  const errors = await forgotValidator(req);
  if (errors.length) return res.send({ success: false, errors });
  else {
    User.findOne({ email }, (err, user) => {
      if (err || !user) return error(res, "email", "This email doesn't exist.");
      else {
        const resetToken = generateRandomToken();
        const resetTokenExpired = Date.now() + HOUR;
        user.resetPwdToken = resetToken;
        user.resetPwdTokenExpired = resetTokenExpired;
        user.save(err => {
          if (err) return error(res, "forgot", "We cannot reset your account.");
          else {
            sendForgotMail(email, user.username, resetToken);
            return res.send({ success: true, errors: [] });
          }
        });
      }
    });
  }
};

exports.verifyAccessReset = async (req, res) => {
  const { username, token } = req.query;
  const errors = await verifyAccessResetValidator(req);
  if (errors.length) return res.send({ success: false, errors });
  else {
    User.findOne({ username }, (err, user) => {
      if (err || !user)
        return error(res, "username", "The username is invalid.");
      else {
        const { resetPwdToken, resetPwdTokenExpired } = user;
        if (resetPwdTokenExpired && resetPwdTokenExpired < Date.now())
          return error(res, "token", "The token is expired.");
        else if (resetPwdToken && resetPwdToken !== token)
          return error(res, "token", "The token is invalid.");
        else return res.send({ success: true, errors: [] });
      }
    });
  }
};

exports.resetPwdUser = async (req, res) => {
  const { username, password } = req.body;
  const errors = await resetPwdValidator(req);
  if (errors.length) return res.send({ success: false, errors });
  else {
    User.findOne({ username }, (err, user) => {
      if (err || !user)
        return error(res, "username", "The username doesn't exist.");
      else {
        const { email } = user;
        user.password = password;
        user.save(err => {
          if (err) return error(res, "reset", "We cannot reset your account.");
          else {
            sendResetMail(email, username);
            return res.send({ success: true, errors: [] });
          }
        });
      }
    });
  }
};
