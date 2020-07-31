const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    joinDate: { type: Date, default: new Date().toISOString() },
    connection: {
        lastVisit: { type: String },
        status: { type: Boolean, required: true, default: false }
    }

})


module.exports = mongoose.model('User', userSchema)