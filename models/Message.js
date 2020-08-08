const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: String, required: true },
    reception: { type: Boolean, required: true, default: false },
    seen: {
        state: { type: Boolean, required: true, default: false },
        seenDate: { type: String }
    },
    images: [{ type: String }],
    content: { type: String, default: '' },
    videos: [{ type: String }],
    audio: { type: String }


})


module.exports = mongoose.model('Message', messageSchema);