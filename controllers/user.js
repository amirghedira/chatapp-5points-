const mongoose = require('mongoose')
const User = require('../models/User')
const bcrypt = require('bcrypt')


exports.registerUser = async (req, res) => {

    const userdata = req.body.user
    try {
        const hashedpw = await bcrypt.hash(userdata.password, 11)
        const newuser = new User({
            name: userdata.name,
            surname: userdata.surname,
            username: userdata.username,
            password: hashedpw,
            joinDate: new Date().toISOString()
        })
        await newuser.save()
        res.status(201).json({ message: 'user successfully created' })

    } catch (error) {
        res.status(500).json({ error: error.meesage })

    }
}

exports.getUsers = async (req, res) => {
    try {

        const users = await User.find()
        res.status(200).json({ users: users })

    } catch (error) {

        res.status(500).json({ error: error.meesage })

    }
}