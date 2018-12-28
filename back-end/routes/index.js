const express = require('express');
const router = express.Router();
const passport = require("passport");

const { 
  signUpUser,
  forgotPwdUser,
  resetPwdUser,
} = require('../controllers/auth');
const { 
  signInLocal,
  signInFortyTwo,
  signInGoogle,
  signInFacebook,
} = require('../controllers/oauth');
const { 
  getMyProfile,
  updateMyProfile,
  getUser,
  getUserById,
} = require('../controllers/profiles');
const {
  getMovieInfos,
  getMovieGenres,
} = require('../controllers/movies');
const {
  getMovieComment,
  postMovieComment,
} = require('../controllers/comments');
const { getMovieSearch } = require('../controllers/search');

const verifyToken = passport.authenticate('jwt', { session: false });

/* User not connected */
router.post('/signup', signUpUser); // DONE
router.post('/forgot', forgotPwdUser);
router.post('/reset/:token', resetPwdUser);

/* Authentication */
router.post('/auth/local', signInLocal); // DONE
router.post('/auth/42', signInFortyTwo);
router.post('/auth/google', signInGoogle);
router.post('/auth/facebook', signInFacebook);

router.get('/profile', verifyToken, getMyProfile);
router.post('/profile', verifyToken, updateMyProfile);
router.get('/profile/:name',verifyToken, getUser);
router.get('/profile/id/:userId', verifyToken, getUserById);

/* Movies */
router.get('/movies/:movieId',verifyToken, getMovieInfos);
router.get('/movies/genres',verifyToken, getMovieGenres);

/* Comments */
router.get('/movies/comment/:movieId', verifyToken, getMovieComment);
router.post('/movies/comment/:movieId', verifyToken, postMovieComment);

/* Search */
router.get('/movies/search/:search', verifyToken, getMovieSearch);

module.exports = router;
