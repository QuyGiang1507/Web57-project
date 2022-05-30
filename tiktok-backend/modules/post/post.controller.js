const PostModel = require('./post');
const CommentModel = require('../comment/comment');
const reactionModel = require('../reaction/reaction');
const { string } = require('joi');

const getAllPosts = async (req, res) => {
    try {
        const {
            keyword,
            createdBy,
            tag,
            skip,
            limit,
            sortField,
            sortDirection,
        } = req.query;

        const { user } = req;

        const createdByFilter = createdBy ? { createdBy } : {};
        const keywordFilter = keyword ?
            {
                $or: [
                    { title: { $regex: new RegExp(`${keyword}`, 'i') } },
                    { description: { $regex: new RegExp(`${keyword}`, 'i') } },
                ]
            } : {};

        const tagFilter = tag ? { tag: tag } : {};

        const filter = {
            ...createdByFilter,
            ...keywordFilter,
            ...tagFilter
        };

        const pagination = {
            skip: skip ? Number(skip) : 0,
            limit: limit ? Number(limit) : 4,
        }

        const sortDirectionParams = sortDirection ? Number(sortDirection) : -1;
        const sortParams = sortField ? {
            [sortField]: sortDirectionParams
        } : {};

        const [posts, totalPosts] = await Promise.all([
            PostModel
                .find(filter)
                .populate('createdBy', '-password -__v')
                .populate({
                    path: 'comment',
                    populate: {
                        path: 'createdBy',
                        select: 'username'
                    }
                })
                .sort(sortParams)
                .skip(pagination.skip)
                .limit(pagination.limit),
            PostModel.find(filter).countDocuments()
        ]);

        let enhanceReactionPosts;

        if (user) {
            const postIds = posts.map(post => post._id)
    
            const reactionPosts = await reactionModel.find({
                $and: [
                    {postId: {$in: postIds}},
                    {userId: {$in: [user._id]}}
                ]
            })
    
            const reactionPostIds = reactionPosts.map(reactionPost => {
                return reactionPost.postId.toString();
            })
    
            enhanceReactionPosts = posts.map(post => {
                const clonePost = JSON.parse(JSON.stringify(post));
    
                return {
                    ...clonePost,
                    isliked: reactionPostIds.includes(clonePost._id),
                }
            })
        } else {
            enhanceReactionPosts = posts.map(post => {
                const clonePost = JSON.parse(JSON.stringify(post));
    
                return {
                    ...clonePost,
                    isliked: false,
                }
            })
        }
        
        res.send({
            success: 1,
            data: {
                data: posts,
                total: totalPosts,
                reaction: enhanceReactionPosts,
            },
        });
    } catch (err) {
        res.status(400).send({
            success: 0,
            data: null,
            message: err.message || 'Something went wrong',
        });
    }
};

const getPost = async (req, res) => {
    const { postId } = req.params;

    const foundPost = await PostModel.findById(postId);

    res.send({
        success: 1,
        data: foundPost,
    });
};

const createPost = async (req, res) => {
    const { user } = req;
    console.log('create post', user);

    const newPostData = req.body;
    const newPost = await PostModel.create({
        ...newPostData,
        createdBy: user._id,
    });

    res.send({
        success: 1,
        data: newPost,
    });
};

const updatePost = async (req, res) => {
    const { postId } = req.params;
    const { user } = req;

    console.log(user);

    const updatePostData = req.body;

    const updatePost = await PostModel.findOneAndUpdate(
        { _id: postId, createdBy: user._id },
        updatePostData,
        { new: true },
    );

    if (!updatePost) {
        throw new Error('Not found post');
    }

    res.send({
        success: 1,
        data: updatePost,
    });
};

const deletePost = async (req, res) => {
    const { postId } = req.params;

    const deletedPost = await PostModel.findOneAndDelete(
        { _id: postId },
        updatePostData,
        { new: true },
    );

    res.send({
        success: 1,
        data: deletedPost,
    });
};

const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { user } = req;

        const updatePost = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { likeCount: 1 } },
            { new: true },
        );

        const reactionPost = await reactionModel.create({
            userId: user._id,
            postId: postId,
        })

        res.send({
            success: 1,
            data: updatePost,
            reaction: reactionPost,
        });
    } catch (err) {
        res.status(400).send({
            success: 0,
            data: null,
            message: err.message || 'Something went wrong',
        });
    }
};

const dislikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { user } = req;

        const updatePost = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { likeCount: -1 } },
            { new: true },
        );

        const reactionPost = await reactionModel.findOneAndDelete(
            {
                userId: user._id,
                postId: postId,
            },
        )

        res.send({
            success: 1,
            data: updatePost,
            reaction: reactionPost,
        });
    } catch (err) {
        res.status(400).send({
            success: 0,
            data: null,
            message: err.message || 'Something went wrong',
        });
    }
};

// const checkLikePost = async (req, res) => {
//     try {
//         const { postId } = req.params;
//         const { user } = req;

//         const checkLike = await PostModel.findById(postId);
//         const userLiked = checkLike.likeBy;

//         if(userLiked.indexOf(user._id) !== -1) {
//             res.send({
//                 success: 1,
//                 data: true,
//             })
//         } else {
//             res.send({
//                 success: 1,
//                 data: false,
//             })
//         }
//     } catch (err) {
//         res.status(400).send({
//             success: 0,
//             data: null,
//             message: err.message || 'Something went wrong',
//         });
//     }
// }

const getCommentByPost = async (req, res) => {
    const { postId } = req.params;

    const comments = await CommentModel.find({ postId }).populate('createdBy').sort({ createdAt: -1 });
    const totalComments = await CommentModel.find({ postId }).countDocuments();

    res.send({
        success: 1,
        data: {
            data: comments,
            total: totalComments,
        }
    });
};

module.exports = {
    getAllPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    likePost,
    dislikePost,
    // checkLikePost,
    getCommentByPost,
}