const express = require('express')
const { isAuthenticated } = require('../middleware')
const router = express.Router()
const userController = require('../controllers/userController')

router.post('/update', isAuthenticated, userController.updateUser)
router.post('/changeAvatar', isAuthenticated, userController.changeAvatar)
router.post('/changeBgImage', isAuthenticated, userController.changeBgImage)
module.exports = router
