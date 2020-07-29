const express = require('express')
const router = express.Router()
const conversationController = require('../controllers/conversation')
const checkAuth = require('../middleware/checkAuth')

router.post('/', checkAuth, conversationController.sendMessage)
router.post('/conversation', checkAuth, conversationController.createConversation)
router.patch('/message/:id', conversationController.markAsSeenMsg)
router.get('/', checkAuth, conversationController.getUserConversations)
router.get('/:converId', checkAuth, conversationController.getConversation)

module.exports = router;