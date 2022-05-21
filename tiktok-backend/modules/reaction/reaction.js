const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
    },
    postId: {
        type: mongoose.Types.ObjectId,
    },
})

const reactionModel = mongoose.model('reaction', reactionSchema);

module.exports = reactionModel;