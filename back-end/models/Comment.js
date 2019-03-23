const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    movieId: {
        type: String,
        default: '',
        required: true,
    },
    commentContent: {
        type: String,
        default: '',
        required: true,
    },
    timestamp: {
        type: String,
        default: '',
        required: true,
    }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;