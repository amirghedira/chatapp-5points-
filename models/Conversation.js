const mongoose = require('mongoose')


const ConversationSchema = new mongoose.Schema({

    messages: [{ type: mongoose.Types.ObjectId, ref: 'Message' }],
    users: [{ type: mongoose.Types.ObjectId, ref: 'User' }]


})


module.exports = mongoose.model('Conversation', ConversationSchema);
