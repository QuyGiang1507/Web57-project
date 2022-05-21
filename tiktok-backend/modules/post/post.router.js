const router = require('express').Router();
const postController = require('./post.controller');
const postValid = require('./post.validation');
const validateInput = require('../../common/middlewares/validateInput');
const isAuth = require('../../common/middlewares/isAuth');
const getUser = require('../../common/middlewares/getUser');
const getUserId = require('../../common/middlewares/getUserId');

router.get(
    '/',
    getUserId,
    postController.getAllPosts,
);
router.get('/:postId', postController.getPost);
router.post(
    '/',
    isAuth,
    postController.createPost,
);
router.put(
    '/:postId',
    isAuth,
    postController.updatePost,
);
router.delete('/:postId', isAuth, postController.deletePost);
router.put('/:postId/like', isAuth, postController.likePost);
router.put('/:postId/dislike', isAuth, postController.dislikePost);
// router.get('/:postId/checklike', isAuth, postController.checkLikePost);
router.get('/:postId/comments', postController.getCommentByPost);

module.exports = router;