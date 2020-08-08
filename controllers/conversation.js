const Message = require('../models/Message')
const Conversation = require('../models/Conversation')
const io = require('socket.io-client')
const socket = io('http://localhost:5000')
const cloudinary = require('../middleware/cloudinary')


filterConversationMessages = (conversation, userid) => {
    const delIndex = conversation.deleted.findIndex(del => del.user.toString() == userid.toString())
    if (delIndex != -1) {
        const firstMessageIndex = conversation.messages.findIndex(message => message._id.toString() == conversation.deleted[delIndex].lastMessage.toString())
        conversation.messages = conversation.messages.filter((message, i) => {
            return i > firstMessageIndex
        })
    }
    return conversation;
}

exports.sendVocalMessage = async (req, res) => {

    console.log(req.files)
    const conversation = await Conversation.findOne({ _id: req.params.id })
    cloudinary.uploader.upload_large(req.files.audio.tempFilePath, { resource_type: 'video' }, async (err, result) => {
        const message = new Message({
            conversation: conversation._id,
            sender: req.user._id,
            date: new Date().toISOString(),
            audio: result.secure_url
        })
        const createdMessage = await message.save()
        conversation.messages.push(message)
        const updatedConversation = await conversation.save()
        res.status(200).json({ message: createdMessage })
    })
}

exports.sendMessage = async (req, res) => {
    try {
        let images = []
        let videos = []
        if (req.files) {
            if (req.files.images)
                images = req.files.images.length ? [...req.files.images] : [req.files.images]
            if (req.files.videos)
                videos = req.files.videos.length ? [...req.files.videos] : [req.files.videos]
        }
        const promiseImages = new Promise((resolve, reject) => {
            const imagesUrl = []
            images.forEach(image => {
                cloudinary.uploader.upload_large(image.tempFilePath, { resource_type: "image", chunk_size: 6000000 }, (err, result) => {
                    if (err)
                        reject(err)
                    imagesUrl.push(result.secure_url)
                    if (imagesUrl.length == images.length)
                        resolve(imagesUrl)

                })
            })
            if (images.length == 0)
                resolve(imagesUrl)
        })
        const promiseVideos = new Promise((resolve, reject) => {
            const videosUrls = []

            videos.forEach(video => {
                cloudinary.uploader.upload_large(video.tempFilePath, { resource_type: "video", chunk_size: 6000000 }, (err, result) => {
                    if (err)
                        reject(err)
                    videosUrls.push(result.secure_url)
                    if (videosUrls.length == videos.length)
                        resolve(videosUrls)
                })

            });
            if (videos.length == 0)
                resolve(videosUrls)
        })
        promiseImages.then(async (imagesUrl) => {
            promiseVideos.then(async (videosUrl) => {
                const conversation = await Conversation.findOne({ _id: req.body.conversationId }).populate('users').populate('messages').exec()
                const newmessage = new Message({
                    conversation: conversation._id,
                    sender: req.user._id,
                    date: new Date().toISOString(),
                    content: req.body.content,
                    images: imagesUrl,
                    videos: videosUrl
                })
                await newmessage.save()
                conversation.messages.push(newmessage)
                conversation.archived = []
                const updatedConversation = await conversation.save()
                const destinationUser = req.user._id == updatedConversation.users[0]._id.toString() ? updatedConversation.users[1]._id : updatedConversation.users[0]._id;
                socket.emit('send-message', { userid: destinationUser, conversation: filterConversationMessages(updatedConversation, destinationUser) })
                res.status(201).json({ newMessage: newmessage })
            })
                .catch(err => { console.log(err) })
        })
            .catch(err => { console.log(err) })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
    }
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
        conversation = filterConversationMessages(conversation, req.user._id)
        res.status(200).json({ conversation: conversation })

    } catch (error) {

        res.status(500).json({ error: error.message })

    }


}

exports.blockUserConversation = async (req, res) => {

    try {
        const conversation = await Conversation.findById(req.params.id)
        if (conversation.blocked.includes(req.body.userid))
            res.status(200).json({ blocked: conversation.blocked })
        else {
            conversation.blocked.push(req.body.userid)
            const savedConversation = await conversation.save()
            res.status(200).json({ blocked: savedConversation.blocked })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}

exports.unBlockUserConversation = async (req, res) => {

    try {
        const conversation = await Conversation.findById(req.params.id)
        if (conversation.blocked.includes(req.body.userid)) {
            const blockIndex = conversation.blocked.findIndex(block => block == req.body.userid)
            conversation.blocked.splice(blockIndex, 1)
            const savedConversation = await conversation.save()
            res.status(200).json({ blocked: savedConversation.blocked })
        }
        else {
            res.status(200).json({ blocked: conversation.blocked })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}
exports.deleteConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id)
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        const deletedUserIds = conversation.deleted.map(del => del.user)
        if (deletedUserIds.includes(req.user._id)) {
            const deleteIndex = conversation.deleted.findIndex(del => del.user == req.user._id)
            conversation.deleted[deleteIndex] = { user: req.user._id, lastMessage }
        } else {
            conversation.deleted.push({ user: req.user._id, lastMessage })
        }
        conversation.archived.push(req.user._id)
        await conversation.save()
        res.status(200).json({ message: 'conversation successfully deleted' })
    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}

exports.updateConversationColor = async (req, res) => {

    try {
        await Conversation.updateOne({ _id: req.params.id }, { $set: { color: req.body.color } })
        res.status(200).json({ message: 'conversation color updated' })

    } catch (error) {
        res.status(500).json({ error: error.message })

    }

}


exports.getConversationByUsers = async (req, res) => {


    try {
        let conversation = await Conversation.findOne({ users: { "$all": [req.user._id, req.params.userid] } }).populate('messages').populate('users').exec()
        if (conversation)
            conversation = filterConversationMessages(conversation, req.user._id)
        res.status(200).json({ conversation })


    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}

exports.updateConversationPseudos = async (req, res) => {

    try {
        const conversation = await Conversation.findById(req.params.id)
        const userPseudosIds = conversation.pseudos.map(pseudo => pseudo.userid)
        if (userPseudosIds.includes(req.body.userid)) {
            const pseudoIndex = conversation.pseudos.findIndex(pseudo => pseudo.userid == req.body.userid)
            conversation.pseudos[pseudoIndex].content = req.body.content
        }
        else {
            conversation.pseudos.push({
                userid: req.body.userid,
                content: req.body.content
            })
        }
        const updatedConversation = await conversation.save()
        res.status(200).json({ conversationPseudos: updatedConversation.pseudos })

    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}

exports.archiveConversation = async (req, res) => {

    try {
        await Conversation.updateOne({ _id: req.params.id }, { $push: { archived: req.user._id } })
        res.status(200).json({ message: 'conversation archived' })


    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.getUserConversations = async (req, res) => {

    try {
        const conversations = await Conversation.find({ $and: [{ users: { "$in": [req.user._id] } }, { archived: { "$nin": [req.user._id] } }] }).populate('users').populate('messages').exec()
        conversations.forEach(conversation => {
            conversation = filterConversationMessages(conversation, req.user._id)

        })
        res.status(200).json({ conversations: conversations })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })

    }
}

exports.markAsSeenConversation = async (req, res) => {

    try {
        const newSeenDate = new Date().toISOString()
        await Message.updateMany({ $and: [{ conversation: req.params.convId }, { "seen.state": false }] }, {
            $set: { seen: { state: true, seenDate: newSeenDate } }
        });
        socket.emit('seen-message', { userid: req.body.userDest, info: { conversation: req.params.convId, seenDate: newSeenDate } })
        res.status(200).json({ seeDate: newSeenDate })
    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}

exports.setMsgReceived = async (req, res) => {

    try {
        const message = await Message.findByIdAndUpdate({ _id: req.params.id }, { $set: { reception: true } })
        message.reception = true
        socket.emit('message-received', { userid: req.body.receptor, message })
        res.status(200).json({ message: 'done' })
    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}