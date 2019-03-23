const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  signUpUser,
  forgotPwdUser,
  resetPwdUser,
  verifyAccessReset
} = require("../controllers/auth");
const {
  signInLocal,
  signInFortyTwo,
  signInGoogle,
  signInFacebook
} = require("../controllers/oauth");
const {
  getAllUsers,
  getUser,
  updateUserById,
  deleteUserById
} = require("../controllers/profiles");
const { uploadAvatar } = require("../controllers/avatars");

const { getMovieInfo, getSortedLibrary } = require("../controllers/movies");
const {
  getAllComments,
  addComment,
  deleteComment
} = require("../controllers/comments");
const {
  updateTimestamps,
  getTimestamps,
  getMoviesDB
} = require("../controllers/moviePlayer");
const { getTorrent } = require("../controllers/torrent");
const { verifyToken } = require("../utils/token");
const {
  getSubtitles,
  getDefaultLanguage
} = require("../controllers/subtitles");

/* User not connected */
router.post("/signup", signUpUser);
router.post("/forgot", forgotPwdUser);
router.post("/reset", resetPwdUser);
router.get("/reset", verifyAccessReset);
router.post("/avatar", uploadAvatar);

/* Authentication */
router.post("/auth/local", signInLocal);
router.get("/auth/42", passport.authenticate("42", { session: false }));
router.get("/auth/42/callback", signInFortyTwo);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/auth/google/callback", signInGoogle);
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["public_profile", "email"] })
);
router.get("/auth/facebook/callback", signInFacebook);

/* Profile */
router.get("/users", verifyToken, getAllUsers);
router.get("/users/:username", verifyToken, getUser);
router.put("/users/:id", verifyToken, updateUserById);
router.delete("/users/:id", verifyToken, deleteUserById);

/* Movies */
router.get("/moviepage/:apiMovieId", verifyToken, getMovieInfo);
router.post("/movies/:genre", verifyToken, getSortedLibrary);

/* Comments */
router.get("/comments/:movieId", verifyToken, getAllComments);
router.post("/comments/:movieId", verifyToken, addComment);
router.delete("/comments/:commentId", verifyToken, deleteComment);

/* Torrent */
router.get("/torrent/:imdbId/:hash/:userId", getTorrent);
router.get("/getSubtitles/:imdbMovieId/:language", getSubtitles);
router.post("/getDefaultLanguage", getDefaultLanguage);
// /* Movies */
router.post("/moviePlayer/:userId", verifyToken, updateTimestamps);
router.get("/moviePlayer/:userId/:movieHash", verifyToken, getTimestamps);
router.post("/moviesDB", verifyToken, getMoviesDB);

module.exports = router;
