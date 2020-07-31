const Message = require('../models/Message')
const Conversation = require('../models/Conversation')
const io = require('socket.io-client')
const socket = io('http://localhost:5000')

exports.sendMessage = async (req, res) => {

    const conversation = await Conversation.findOne({ _id: req.body.conversationId }).populate('users').populate('messages').exec()
    const newmessage = new Message({
        conversation: conversation._id,
        sender: req.user._id,
        date: new Date().toISOString(),
        content: req.body.content
    })
    await newmessage.save()
    conversation.messages.push(newmessage)
    const updatedConversation = await conversation.save()
    socket.emit('send-message', { userid: req.user._id == updatedConversation.users[0]._id.toString() ? updatedConversation.users[1]._id : updatedConversation.users[0]._id, conversation: updatedConversation })
    res.status(201).json({ newMessage: newmessage })
}

exports.createConversation = async (req, res) => {


    const newConversation = {
        users: [req.body.destination, req.user._id]
    }
    const { _id } = await Conversation.create(newConversation)
    const conversation = await Conversation.findById(_id).populate('users')

    res.status(201).json({ conversation: conversation })
}

exports.getConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.converId).populate('messages').populate('users').exec()
        res.status(200).json({ conversation: conversation })

    } catch (error) {

        res.status(500).json({ error: error.message })

    }


}

exports.getUserConversations = async (req, res) => {

    try {
        const conversations = await Conversation.find({ users: { "$in": [req.user._id] } }).populate('users').populate('messages').exec()
        res.status(200).json({ conversations: conversations })

    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}

exports.markAsSeenMsg = async (req, res) => {

    try {
        const newSeenDate = new Date().toISOString()
        const message = await Message.findById(req.params.id);
        message.seen = { state: true, seenDate: newSeenDate }
        await message.save()

        socket.emit('seen-message', { userid: req.body.userDest, message })
        res.status(200).json({ message: 'message has been seen' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })

    }
}
