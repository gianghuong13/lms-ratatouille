import express from 'express';
import forumManageController from '../../controllers/forumManage/forumManage.controller.js';

const router = express.Router();

// Post routes
router.get('/posts/course/:course_id', forumManageController.getAllPostsByCourseId);
router.get('/posts/:post_id', forumManageController.getPostById);
router.post('/posts', forumManageController.createPost);
router.put('/posts/:post_id', forumManageController.updatePost);
router.delete('/posts/:post_id', forumManageController.deletePost);

// Comment routes
router.get('/comments/post/:post_id', forumManageController.getAllCommentsByPostId);
router.post('/comments', forumManageController.createComment);
router.put('/comments/:comment_id', forumManageController.updateComment);
router.delete('/comments/:comment_id', forumManageController.deleteComment);

export default router;