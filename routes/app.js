const express = require('express')
const { isAuthenticated } = require('../middleware')
const router = express.Router()

const appController = require('../controllers/appController')

router.get('/', isAuthenticated, appController.home)
router.get('/suggestions', isAuthenticated, appController.suggestions)
router.get('/network', isAuthenticated, appController.network)
router.get('/settings', isAuthenticated, appController.settings)
router.get('/friend-requests', isAuthenticated, appController.friendRequests)
router.get('/search', isAuthenticated, appController.searchPage)
router.get('/about-us', isAuthenticated, appController.aboutUs)

// user profile using the url slug
router.get('/:slug', isAuthenticated, appController.userProfile)
module.exports = router
