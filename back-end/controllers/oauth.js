const passport = require("passport");
const jwt = require("jsonwebtoken");
const { signInValidator } = require("../utils/inputsValidator");

exports.signInLocal = async (req, res, next) => {
  const errors = await signInValidator(req);
  if (errors.length)
    return res.send({ success: false, errors });

  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.send({ success: false, errors: info });

    const { _id, username, email } = user;
    const token = jwt.sign(
      { id: _id, username, email, provider: "local" },
      process.env.JWTSECRETKEY,
      { expiresIn: "7d" },
    );

    res.send({ success: true, token });
  })(req, res, next);
};

exports.signInFortyTwo = (req, res) => {};

exports.signInGoogle = (req, res) => {};

exports.signInFacebook = (req, res) => {};
