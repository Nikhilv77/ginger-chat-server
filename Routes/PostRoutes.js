import express from 'express'
const router = express.Router();
import { createPost,deletePost,getPost,updatePost,likePost,getAllPosts,dislikePost,getComments,makeComment, getLikes,getUserPosts } from '../Controllers/PostControllers.js';
router.get('/getAllPosts',getAllPosts)
router.get('/:id/get-user-posts',getUserPosts)
router.post('/createPost',createPost);
router.delete('/:id/delete',deletePost);
router.get('/:id',getPost);
router.put('/:id',updatePost);
router.get('/:id/get-likes',getLikes);
router.put('/:id/like',likePost);
router.put('/:id/dislike', dislikePost);
router.get('/:id/comments',getComments);
router.post('/:id/make-comment',makeComment);

// Export the router
export default router;