import express from 'express'
import { getUser,updateUser,deleteUser,  getAllUsers, sendFriendRequest,undoFriendRequest,getAllUserNames, getAllUserEmails,getAllUserIds,updateCreatedChat, getFilteredUsers,acceptFriendRequest,declineFriendRequest,unfriendUser } from '../Controllers/UserController.js';
const router = express.Router();
// import authMiddleWare from '../Middleware/authMiddleware.js';

router.get('/getAllUsers',getAllUsers)
router.get('/getAllUserNames',getAllUserNames)
router.get('/getAllUsersIds',getAllUserIds)
router.get('/getAllUserEmails',getAllUserEmails)
router.get('/getFilteredUsers/:filter',getFilteredUsers)
router.get('/:id',getUser)
router.put('/:id',updateUser)
router.put('/update-created-chat/:id',updateCreatedChat)
router.delete('/:id',deleteUser)
router.post('/sendFriendRequest',sendFriendRequest)
router.post('/acceptFriendRequest',acceptFriendRequest)
router.post('/declineFriendRequest',declineFriendRequest)
router.post('/unfriendUser',unfriendUser)
router.post('/undoFriendRequest',undoFriendRequest)

export default router;
