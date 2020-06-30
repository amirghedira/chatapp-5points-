const Message = require('../models/Message')
const User = require('../models/User')


exports.sendMessage = async (req, res) => {

    const newmessage = new Message({
        from: req.body.sourceID,
        to: req.body.destinationID,
        date: new Date().toISOString(),
        content: req.body.content
    })

    try {

        await newmessage.save()
        res.status(201).json({ message: 'message sent' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }


}

exports.getConversationMessages = async (req, res) => {

    try {
        const conversationMsgs = await Message.find({ $and: [{ from: req.body.source }, { to: req.body.destination }] })
        res.status(200).json({ messages: conversationMsgs })

    } catch (error) {

        res.status(500).json({ error: error.message })

    }


}
