const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userRoutes = require('./routes/user')
const conversationRoutes = require('./routes/conversation')
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_INFO, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})


app.use('/user', userRoutes)
app.use('/conversation', conversationRoutes)



module.exports = app