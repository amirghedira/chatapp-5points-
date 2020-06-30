const express = require('express')
const router = express.Router()
const messagesController = require('../controllers/message')


router.post('/', messagesController.sendMessage)
router.get('/', messagesController.getConversationMessages)



module.exports = router;