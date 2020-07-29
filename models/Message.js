const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, required: true },
    seen: { type: Boolean, required: true, default: false },
    content: { type: String, required: true },

})


module.exports = mongoose.model('Message', messageSchema);