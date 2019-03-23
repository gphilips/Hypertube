const Comment = require("../models/Comment");
const User = require("../models/User");
const { commentsValidator } = require("../utils/inputsValidator");
var moment = require("moment");

exports.getAllComments = (req, res) => {
  const { movieId } = req.params;
  if (!movieId) {
    return res.send({
      success: false,
      errors: [
        {
          param: "comment",
          msg: "Couldn't identify this movie."
        }
      ]
    });
  } else {
    Comment.aggregate(
      [
        {
          $match: {
            movieId: movieId
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "author"
          }
        }
      ],
      function(err, comments) {
        if (err || !comments) {
          return res.send({
            success: false,
            errors: [
              {
                param: "comment",
                msg: "No comments found for this movie."
              }
            ]
          });
        } else {
          return res.send({
            success: true,
            comments
          });
        }
      }
    );
  }
};

exports.addComment = async (req, res) => {
  const userId = req.body.userId;
  const movieId = req.params.movieId;
  const commentContent = req.body.commentContent.toString();
  const timestamp = moment().format("LLLL");
  const errors = await commentsValidator(req);
  if (errors.length) return res.send({ success: false, errors });
  const comment = new Comment({
    userId,
    movieId,
    commentContent,
    timestamp
  });
  User.findOne({ _id: userId }, (err, userExist) => {
    if (err || !userExist) {
      return res.send({
        success: false,
        errors: [
          {
            param: "username",
            msg: "This username does not seem to exist."
          }
        ]
      });
    }
    comment.save(err => {
      if (err) {
        return res.send({
          success: false,
          errors: [
            {
              param: "addComment",
              msg: "We cannot save your comment."
            }
          ]
        });
      } else {
        let returnComment = {
          userId,
          movieId,
          commentContent,
          timestamp,
          author: [
            {
              avatar: userExist.avatar,
              username: userExist.username
            }
          ]
        };
        return res.send({
          success: true,
          returnComment
        });
      }
    });
  });
};

exports.deleteComment = (req, res) => {
  const { commentId } = req.params;
  Comment.deleteOne({ _id: commentId }, err => {
    if (err) {
      return res.send({
        success: false,
        errors: [
          {
            param: "comment",
            msg: "We could'nt delete your comment."
          }
        ]
      });
    } else {
      return res.send({
        success: true,
        errors: []
      });
    }
  });
};
