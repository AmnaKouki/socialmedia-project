const express = require('express')
const { isAuthenticated } = require('../middleware')
const router = express.Router()
const commentController = require('../controllers/commentController')

router.post('/create', isAuthenticated, commentController.createComment)

module.exports = router
