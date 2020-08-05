const Message = require('../models/Message')
const Conversation = require('../models/Conversation')
const io = require('socket.io-client')
const socket = io('http://localhost:5000')
const cloudinary = require('../middleware/cloudinary')


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
                    console.log(result.secure_url)
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
                if (conversation.archived.includes(req.user._id)) {
                    const archivedIndex = conversation.archived.findIndex(user => user == req.user._id)
                    conversation.archived.splice(archivedIndex, 1)
                }
                const updatedConversation = await conversation.save()
                socket.emit('send-message', { userid: req.user._id == updatedConversation.users[0]._id.toString() ? updatedConversation.users[1]._id : updatedConversation.users[0]._id, conversation: updatedConversation })
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

exports.sendVideoedMessage = async (req, res) => {

    const videos = req.files.videos.length ? [...req.files.videos] : [req.files.videos]
    new Promise((resolve, reject) => {
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

    }).then(async (videosUrl) => {
        try {
            const conversation = await Conversation.findOne({ _id: req.body.conversationId }).populate('users').populate('messages').exec()
            const newmessage = new Message({
                conversation: conversation._id,
                sender: req.user._id,
                date: new Date().toISOString(),
                content: req.body.content,
                videos: videosUrl
            })
            await newmessage.save()
            conversation.messages.push(newmessage)
            if (conversation.archived.includes(req.user._id)) {
                const archivedIndex = conversation.archived.findIndex(user => user == req.user._id)
                conversation.archived.splice(archivedIndex, 1)
            }
            const updatedConversation = await conversation.save()
            socket.emit('send-message', { userid: req.user._id == updatedConversation.users[0]._id.toString() ? updatedConversation.users[1]._id : updatedConversation.users[0]._id, conversation: updatedConversation })
            res.status(201).json({ newMessage: newmessage })
        } catch (error) {
            res.status(500).json({ error: error })

        }
    })

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
        if (conversation.deleted.includes(req.user._id)) {

            res.status(200).json({ message: 'conversation already deleted for this user' })
        }
        else {
            if (conversation.deleted.length > 0) {
                await Conversation.deleteOne({ _id: req.params.id })
                res.status(200).json({ message: 'conversation deleted' })
            }
            else {
                conversation.deleted.push(req.user._id)
                await conversation.save()
            }
        }
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
        const conversation = await Conversation.findOne({ users: { "$in": [req.user._id, req.params.userid] } }).populate('messages').populate('users').exec()
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
        console.log(req.user)
        await Conversation.updateOne({ _id: req.params.id }, { $push: { archived: req.user._id } })
        res.status(200).json({ message: 'conversation archived' })


    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.getUserConversations = async (req, res) => {

    try {
        const conversations = await Conversation.find({ $and: [{ users: { "$in": [req.user._id] } }, { archived: { "$nin": [req.user._id] } }] }).populate('users').populate('messages').exec()
        res.status(200).json({ conversations: conversations })

    } catch (error) {
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