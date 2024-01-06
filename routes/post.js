const express = require('express')
const { isAuthenticated } = require('../middleware')
const router = express.Router()
const postController = require('../controllers/postController')

router.post('/', isAuthenticated, postController.createPost)
router.post('/ImageUpload', isAuthenticated, postController.uploadImage)
router.post('/postPhoto', isAuthenticated, postController.postImage)
router.post('/delete', isAuthenticated, postController.deletePost)
router.post('/like', isAuthenticated, postController.likePost)
module.exports = router
