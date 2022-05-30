const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    videoUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    song: {
        type: String,
    },
    likeCount: {
        type: Number,
        default: 0,
    },
    tags: [{
        type: mongoose.Types.ObjectId
    }],
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, {
    timestamps: true,
    toJSON: { virtual: true },
    toObject: { virtual: true }
});

PostSchema.virtual('comment', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'postId',
})

const PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;