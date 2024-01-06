const express = require('express')
const { isAuthenticated } = require('../middleware')
const router = express.Router()
const friendsController = require('../controllers/friendsConroller')

router.post('/create', isAuthenticated, friendsController.sendFriendRequest)
router.post('/accept', isAuthenticated, friendsController.acceptFriendRequest)
router.post('/decline', isAuthenticated, friendsController.declineFriendRequest)
router.post('/delete', isAuthenticated, friendsController.deleteFriend)
router.post('/cancel', isAuthenticated, friendsController.cancelFriendRequest)

module.exports = router
