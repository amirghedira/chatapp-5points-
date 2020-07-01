const express = require('express')
const router = express.Router()
const messagesController = require('../controllers/message')
const checkAuth = require('../middleware/checkAuth')


router.post('/', checkAuth, messagesController.sendMessage)

router.get('/:participant', checkAuth, messagesController.getConversationMessages)

module.exports = router;