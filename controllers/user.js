const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const io = require('socket.io-client')
const socket = io('http://localhost:5000')
const Conversation = require('../models/Conversation')
const Message = require('../models/Message')
const cloudinary = require('../middleware/cloudinary')

exports.uploadImage = async (req, res, next) => {
    if (req.files) {
        cloudinary.uploader.upload_large(req.files.profileImage.tempFilePath, { resource_type: 'image' }, async (err, result) => {
            req.body.secure_url = result.secure_url;
            return next()
        })
    } else {

        return next()
    }
}

exports.registerUser = async (req, res) => {

    const userdata = req.body
    try {
        const user = await User.findOne({ username: userdata.username }).exec()
        if (user)
            res.status(409).json({ message: 'username already taken' })
        else {
            const hashedpw = await bcrypt.hash(userdata.password, 11)
            const newuser = new User({
                name: userdata.name,
                surname: userdata.surname,
                username: userdata.username,
                password: hashedpw,
                joinDate: new Date().toISOString(),
                address: userdata.address,
                profileImg: userdata.secure_url,
                tel: userdata.phone
            })
            await newuser.save()
            res.status(201).json({ message: 'user successfully created' })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}
exports.getUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
        if (user)
            res.status(200).json(user)
        else
            res.status(404).json({ message: 'user not found' })
    } catch (error) {
        res.status(500).json({ error: error.meesage })

    }
}

exports.updateUserInfo = async (req, res) => {

    try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, { $set: { ...req.body.user } })
        res.status(200).json({ updatedUser })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.meesage })

    }
}

exports.updateUserPassword = async (req, res) => {

    try {
        const user = await User.findById(req.user._id)
        if (user) {
            const match = await bcrypt.compare(req.body.oldPassword, user.password)
            if (match) {
                const newPassword = await bcrypt.hash(req.body.newPassword, 12)
                user.password = newPassword
                await user.save()
                res.status(200).json({ message: 'user password successfully updated' })
            } else {
                res.status(401).json({ message: 'wrong password' })
            }
        }
        else
            res.status(404).json({ message: 'user not found' })


    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.meesage })

    }
}

exports.updateProfileImg = async (req, res) => {
    cloudinary.uploader.upload_large(req.files.profileImage.tempFilePath, { resource_type: 'image' }, async (err, result) => {
        if (err)
            return res.status(500).json({ message: 'upload failed' })

        await User.updateOne({ _id: req.user._id }, { $set: { profileImg: result.secure_url } })
        res.status(200).json({ imageUrl: result.secure_url })
    })
}

exports.getUserBytoken = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id })
        res.status(200).json({ user: user })

    } catch (error) {

        res.status(500).json({ error: error.meesage })

    }

}

exports.getUsers = async (req, res) => {
    try {

        const users = await User.find({ username: { $not: { $regex: req.user.username } } })
        res.status(200).json({ users: users })

    } catch (error) {
        res.status(500).json({ error: error.meesage })

    }
}

exports.userLogin = async (req, res) => {

    try {
        const user = await User.findOne({ username: req.body.username })
        if (user) {
            const result = await bcrypt.compare(req.body.password, user.password)
            if (result) {
                const generatedToken = await jwt.sign({
                    username: user.username,
                    _id: user._id
                }, process.env.JWT_SECRET_KEY)
                const conversations = await Conversation.find({ users: { "$in": [user._id] } })
                conversations.forEach(async (conversation) => {
                    await Message.updateMany({ conversation: conversation._id, reception: false }, { $set: { reception: true } })

                })
                res.status(200).json({ user: user, token: generatedToken })
            }
            else
                res.status(401).json({ message: 'Authentification failed' })


        }
        else
            res.status(401).json({ message: 'Authentification failed' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.meesage })

    }
}
exports.disconnectUser = async (req, res) => {
    try {
        const lastVisitDate = new Date().toISOString()
        await User.updateOne({ _id: req.body.userId }, { $set: { connection: { status: false, lastVisit: lastVisitDate } } })
        socket.emit('user-disconnected', { userid: req.body.userId, lastVisit: lastVisitDate })
        res.status(200).json({ message: 'user disconnected' })
    } catch (error) {
        res.status(500).json({ error: error.meesage })

    }
}
exports.searchUsers = async (req, res) => {
    try {
        let terms = req.query.term;
        let users = []
        if (terms.includes(' ')) {

            terms = req.query.term.split(' ')
            users = await User.find({ $or: [{ username: { $regex: terms[0] } }, { username: { $regex: terms[1] } }, { name: { $regex: terms[0] } }, { name: { $regex: terms[1] } }, { surname: { $regex: terms[0] } }, { surname: { $regex: terms[1] } }], $and: [{ _id: { $ne: req.user._id } }] }).exec()

        } else {
            users = await User.find({ $or: [{ username: { $regex: terms } }, { name: { $regex: terms } }, { surname: { $regex: terms } }], $and: [{ _id: { $ne: req.user._id } }] }).exec()

        }

        res.status(200).json({ users: users })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}