const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    postId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Post',
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, {
    timestamps: true
});

const CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = CommentModel;