const passport = require("passport");
const { signInValidator } = require("../utils/inputsValidator");
const { generateToken } = require("../utils/token");

exports.signInLocal = async (req, res, next) => {
  const errors = await signInValidator(req);
  if (errors.length) return res.send({ success: false, errors });

  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.send({ success: false, errors: info });
    const token = generateToken(user, 'local');
    res.send({ success: true, token });
  })(req, res, next);
};

exports.signInFortyTwo = (req, res, next) => {
  passport.authenticate("42", (err, user) => {
    if (err) return next(err);
    if (!user)
      res.redirect(`http://localhost:3000/sign-in?error=true`);
    else {
      const token = generateToken(user, '42');
      res.redirect(`http://localhost:3000/sign-in?token=${token}`);
    }
  })(req, res, next);
};

exports.signInGoogle = (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    if (err) return next(err);
    if (!user)
      res.redirect(`http://localhost:3000/sign-in?error=true`);
    else {
      const token = generateToken(user, 'google');
      res.redirect(`http://localhost:3000/sign-in?token=${token}`);
    }
  })(req, res, next);
};

exports.signInFacebook = (req, res, next) => {
  passport.authenticate("facebook", (err, user) => {
    if (err) return next(err);
    if (!user)
      res.redirect(`http://localhost:3000/sign-in?error=true`);
    else {
      const token = generateToken(user, 'facebook');
      res.redirect(`http://localhost:3000/sign-in?token=${token}`);
    }
  })(req, res, next);
};
