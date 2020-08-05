const http = require('http');
const app = require('./app')
const server = http.createServer(app)
const io = require('socket.io')(server);
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const ConnectedUsers = [];
server.listen(process.env.PORT || 5000, () => {

    io.on('connection', (socket) => {
        socket.on('connectuser', async (token) => {
            try {
                let user = jwt.verify(token, process.env.JWT_SECRET_KEY)
                if (user) {
                    const userindex = ConnectedUsers.findIndex(connecteduser => {
                        return connecteduser.userid === user._id
                    })
                    if (userindex < 0) {
                        ConnectedUsers.push({ userid: user._id, socketid: socket.id })
                    }
                    await User.updateOne({ _id: user._id }, { $set: { connection: { status: true, lastVisit: new Date().toISOString() } } })
                    socket.broadcast.emit('user-connected', user._id)
                }

            } catch (error) {
                console.log('error')
            }
        })
        socket.on('showUsers', () => {
            console.log(ConnectedUsers)
        })
        socket.on('send-message', (data) => {
            const userindex = ConnectedUsers.findIndex(connecteduser => {
                return connecteduser.userid === data.userid
            })

            if (userindex >= 0)
                socket.broadcast.to(ConnectedUsers[userindex].socketid).emit('send-message', data.conversation)
        })
        socket.on('seen-message', (data) => {
            const userindex = ConnectedUsers.findIndex(connecteduser => {
                return connecteduser.userid === data.userid
            })
            if (userindex >= 0)
                socket.broadcast.to(ConnectedUsers[userindex].socketid).emit('seen-message', data.info)
        })
        socket.on('message-received', (data) => {
            const userindex = ConnectedUsers.findIndex(connecteduser => {
                return connecteduser.userid === data.userid
            })
            if (userindex >= 0)
                socket.broadcast.to(ConnectedUsers[userindex].socketid).emit('message-received', data.message)
        })
        socket.on('user-disconnected', (obj) => {
            socket.broadcast.emit('user-disconnected', obj)
        })
        socket.on('disconnect', async () => {
            const userindex = ConnectedUsers.findIndex(connecteduser => {
                return connecteduser.socketid === socket.id
            })
            console.log(userindex)
            console.log(ConnectedUsers[userindex])
            console.log('==================================')
            if (userindex >= 0) {
                const lastVisitDate = new Date().toISOString()
                await User.updateOne({ _id: ConnectedUsers[userindex].userid }, { $set: { connection: { status: false, lastVisit: lastVisitDate } } })
                socket.broadcast.emit('user-disconnected', { userid: ConnectedUsers[userindex].userid, lastVisit: lastVisitDate })
                ConnectedUsers.splice(userindex, 1)
            }
        })
    })
})