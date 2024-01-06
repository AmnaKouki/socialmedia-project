const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')


router.get('/login', authController.showLoginPage)
router.post('/login', authController.login)
router.get('/register', authController.showRegisterPage)
router.get('/logout', authController.logout)
router.post('/register', authController.register)
router.post('/refreshToken', authController.refreshToken)
router.post('/revokeRefreshTokens', authController.revokeRefreshTokens)

module.exports = router
