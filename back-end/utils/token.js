const jwt = require("jsonwebtoken");
const randomToken = require("random-token");
const passport = require("passport");

exports.generateToken = (user, provider) => {
    const { _id, username, email } = user;
    const token = jwt.sign(
      { id: _id, username, email, provider },
      process.env.JWTSECRETKEY,
      { expiresIn: "3d" }
  );
  return `Bearer ${token}`;
};

exports.generateRandomToken = () => randomToken(16);

exports.verifyToken = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.send({ success: false, errors: info });
    next();
  })(req, res, next);
};