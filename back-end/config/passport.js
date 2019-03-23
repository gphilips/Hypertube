const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FortyTwoStrategy = require("passport-42").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const User = require("../models/User");
const { generateRandomToken } = require("../utils/token");

const setPassportStrategies = () => {
	passport.use(
		new LocalStrategy((username, password, done) => {
			try {
				User.findOne({ username }, (err, user) => {
					if (err) return done(err);
					if (!user)
						return done(null, false, [
							{ param: "username", msg: "Username is incorrect." },
						]);

					user.comparePassword(password, (err, isMatch) => {
						if (err) return done(err);
						return isMatch
							? done(null, user)
							: done(null, false, [
									{ param: "password", msg: "Password is incorrect." },
							  ]);
					});
				});
			} catch (error) {
				done(error, false, error.message);
			}
		})
	);

	passport.use(
		new FortyTwoStrategy(
			{
				clientID: process.env.FORTYTWO_APP_ID,
				clientSecret: process.env.FORTYTWO_APP_SECRET,
				callbackURL: "http://localhost:5000/api/auth/42/callback",
			},
			(accessToken, refreshToken, profile, cb) => {
				try {
					User.findOne(
						{
							$or: [
								{ fortytwoId: profile.id },
								{ email: profile.emails[0].value },
							],
						},
						(err, userData) => {
							if (err) return cb(err, false);
							else if (userData) {
								userData.fortytwoId = profile.id;
								userData.save(err => cb(err, userData));
							} else {
								const username = profile.displayName.replace(/\s/g, "");
								User.findOne({ username }, (err, user) => {
									if (err) return cb(err, false);
									else if (user) {
										user.fortytwoId = profile.id;
										user.save(err => cb(err, user));
									} else {
										const user = new User();
										user.fortytwoId = profile.id;
										user.email = profile.emails[0].value;
										user.username = username;
										user.password = generateRandomToken(10);
										user.firstname = profile.name.givenName;
										user.lastname = profile.name.familyName;
										user.avatar = profile.photos[0].value;
										user.save(err => cb(err, user));
									}
								});
							}
						}
					);
				} catch (error) {
					done(error, false, error.message);
				}
			}
		)
	);

	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: "http://localhost:5000/api/auth/google/callback",
			},
			(accessToken, refreshToken, profile, cb) => {
				try {
					User.findOne(
						{
							$or: [
								{ googleId: profile.id },
								{ email: profile.emails[0].value },
							],
						},
						(err, userData) => {
							if (err) return cb(err, false);
							if (userData) {
								userData.googleId = profile.id;
								userData.save(err => cb(err, userData));
							} else {
								const username = profile.displayName.replace(/\s/g, "");
								User.findOne({ username }, (err, user) => {
									if (err) return cb(err, false);
									else if (user) {
										user.googleId = profile.id;
										user.save(err => cb(err, user));
									} else {
										const user = new User();
										user.googleId = profile.id;
										user.email = profile.emails[0].value;
										user.username = username;
										user.password = generateRandomToken(10);
										user.firstname = profile.name.givenName;
										user.lastname = profile.name.familyName;
										user.avatar = profile.photos[0].value;
										user.save(err => cb(err, user));
									}
								});
							}
						}
					);
				} catch (error) {
					done(error, false, error.message);
				}
			}
		)
	);

	passport.use(
		new FacebookStrategy(
			{
				clientID: process.env.FACEBOOK_CLIENT_ID,
				clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
				callbackURL: "http://localhost:5000/api/auth/facebook/callback",
				profileFields: [
					"id",
					"displayName",
					"first_name",
					"last_name",
					"photos",
					"email",
				],
			},
			(accessToken, refreshToken, profile, cb) => {
				try {
					User.findOne(
						{
							$or: [
								{ facebookId: profile.id },
								{ email: profile.emails[0].value },
							],
						},
						(err, userData) => {
							if (err) return cb(err, false);
							else if (userData) {
								userData.facebookId = profile.id;
								userData.save(err => cb(err, userData));
							} else {
								const username = profile.displayName.replace(/\s/g, "");
								User.findOne({ username }, (err, user) => {
									if (err) return cb(err, false);
									if (user) {
										user.facebookId = profile.id;
										user.save(err => cb(err, user));
									} else {
										const user = new User();
										user.facebookId = profile.id;
										user.email = profile.emails[0].value;
										user.username = username;
										user.password = generateRandomToken(10);
										user.firstname = profile.name.givenName;
										user.lastname = profile.name.familyName;
										user.avatar = profile.photos[0].value;
										user.save(err => cb(err, user));
									}
								});
							}
						}
					);
				} catch (error) {
					done(error, false, error.message);
				}
			}
		)
	);

	passport.use(
		new JwtStrategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
				secretOrKey: process.env.JWTSECRETKEY,
			},
			(jwt_payload, done) => {
				try {
					User.findById(jwt_payload.id, (err, user) => {
						if (err) return done(err, false);
						if (user) return done(null, user);
						else
							return done(null, false, [
								{ param: "token", msg: "Your token is expired." },
							]);
					});
				} catch (err) {
					console.log(err);
				}
			}
		)
	);
};

module.exports = setPassportStrategies;
