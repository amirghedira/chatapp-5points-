const express = require('express')
const router = express.Router();
const userController = require('../controllers/user')
const checkAuth = require('../middleware/checkAuth')

router.post('/', userController.registerUser)
router.get('/', checkAuth, userController.getUsers)
router.get('/bytoken', checkAuth, userController.getUserBytoken)
router.post('/login', userController.userLogin)


module.exports = router
