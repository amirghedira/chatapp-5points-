const mongoose = require('mongoose')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


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

exports.userLogin = async (req, res) => {

    try {

        const user = await User.find({ username: req.body.username })
        if (user) {
            const result = await bcrypt.compare(req.body.password, user.password)
            if (result) {
                const generatedToken = await jwt.sign({
                    username: user.username,
                    _id: user._id
                }, process.env.JWT_SECRET_KEY)
                res.status(200).json({ message: 'user logged successfully logged in', token: generatedToken })
            }
            else
                res.status(401).json({ message: 'Authentification failed' })


        }
        else
            res.status(401).json({ message: 'Authentification failed' })

    } catch (error) {

        res.status(500).json({ error: error.meesage })

    }
}
