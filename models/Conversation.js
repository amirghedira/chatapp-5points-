const mongoose = require('mongoose')
const Message = require('./Message')

const ConversationSchema = new mongoose.Schema({

    messages: [{ type: mongoose.Types.ObjectId, ref: 'Message' }],
    users: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    pseudos: [{ userid: mongoose.Types.ObjectId, content: String }],
    color: { type: String, required: true, default: "rgb(0, 132, 255)" },
    archived: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    blocked: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    deleted: [{ type: mongoose.Types.ObjectId, ref: 'User' }],


})

ConversationSchema.pre('remove', async (next, docs) => {
    console.log(docs)
    await Message.deleteMany({ conversation: docs._id })
    next();

})


module.exports = mongoose.model('Conversation', ConversationSchema);
