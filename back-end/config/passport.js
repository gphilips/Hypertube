const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '.env')})
const User = require("../models/User");

const setPassportStrategies = () => {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email }, (err, user) => {
        if (err) return done(err);
        if (!user)
          return done(null, false, [{ param: 'email', msg: "Email is incorrect." }]);
  
        user.comparePassword(password, (err, isMatch) => {
          if (err) return done(err);
          return isMatch
            ? done(null, user)
            : done(null, false, [{ param: 'password', msg: 'Password is incorrect.' }]);
        });
  
      });
    })
  );

  passport.use(
    new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWTSECRETKEY,
    }, (jwt_payload, done) => {
      User.findById(jwt_payload.sub, (err, user) => {
        if (err) return done(err, false);
        if (user)
          return done(null, user);
        else
          return done(null, false, [{ param: 'token', msg: 'Your token is expired.' }]);
      });
    })
  );
}

module.exports = setPassportStrategies;
