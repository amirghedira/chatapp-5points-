const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    joinDate: { type: Date, default: new Date().toISOString() }

})


module.exports = mongoose.model('User', userSchema)