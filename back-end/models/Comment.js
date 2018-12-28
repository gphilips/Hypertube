const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;