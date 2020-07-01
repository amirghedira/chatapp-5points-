const Message = require('../models/Message')
const io = require('socket.io-client')
const socket = io('http://localhost:5000')

exports.sendMessage = async (req, res) => {

    const newmessage = new Message({
        from: req.user._id,
        to: req.body.destination,
        date: new Date().toISOString(),
        content: req.body.content
    })

    try {

        const newMessage = await newmessage.save()
        socket.emit('send-message', { userid: newmessage.to, message: newMessage })
        res.status(201).json({ newMessage: newMessage })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }


}

exports.getConversationMessages = async (req, res) => {
    try {
        const messages = await Message.find()
        const conversationMsgs = messages.filter(message => { return (message.from == req.user._id && message.to == req.params.participant) || (message.to == req.user._id && message.from == req.params.participant) })
        res.status(200).json({ conversationMsgs: conversationMsgs })

    } catch (error) {

        res.status(500).json({ error: error.message })

    }


}
