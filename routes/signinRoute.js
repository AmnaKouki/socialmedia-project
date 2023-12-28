
const express = require('express');
const router = express.Router();

const signinController = require('../controllers/signinController');

router.get('/signin', signinController.getSigninPage);
router.post('/signin', signinController.postSignin);

module.exports = router;
