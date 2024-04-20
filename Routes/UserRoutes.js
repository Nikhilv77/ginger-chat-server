import express from 'express'
import { getUser,updateUser,deleteUser, followUser,unfollowUser, getAllUsers, sendFriendRequest,undoFriendRequest } from '../Controllers/UserController.js';
const router = express.Router();

router.get('/getAllUsers',getAllUsers)
router.get('/:id',getUser)
router.put('/:id',updateUser)
router.delete('/:id',deleteUser)
router.put('/:id/follow',followUser)
router.put('/:id/unfollow',unfollowUser)
router.post('/sendFriendRequest',sendFriendRequest)
router.post('/undoFriendRequest',undoFriendRequest)
export default router;