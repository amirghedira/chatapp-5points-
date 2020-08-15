const http = require('http');
const app = require('./app')
const server = http.createServer(app)
const io = require('socket.io')(server);
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const ConnectedUsers = [];
server.listen(process.env.PORT || 5000, () => {

    io.on('connection', (socket) => {
        socket.on('connectuser', async (token, isCall) => {
            try {
                let user = jwt.verify(token, process.env.JWT_SECRET_KEY)
                if (user) {
                    const userindex = ConnectedUsers.findIndex(connecteduser => {
                        return connecteduser.userid === user._id
                    })
                    if (userindex < 0) {
                        if (isCall)
                            ConnectedUsers.push({ userid: user._id, socketIdCall: socket.id })
                        else
                            ConnectedUsers.push({ userid: user._id, socketIds: [socket.id] })

                        await User.updateOne({ _id: user._id }, { $set: { connection: { status: true, lastVisit: new Date().toISOString() } } })
                        socket.broadcast.emit('user-connected', user._id)
                    } else {
                        if (isCall)
                            ConnectedUsers[userindex].socketIdCall = socket.id;
                        else
                            if (ConnectedUsers[userindex].socketIds)
                                ConnectedUsers[userindex].socketIds.push(socket.id)
                            else
                                ConnectedUsers[userindex].socketIds = [socket.id]
                    }
                }

            } catch (error) {
                console.log(error)
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
                ConnectedUsers[userindex].socketIds.forEach(socketId => {
                    socket.broadcast.to(socketId).emit('send-message', data.conversation)
                })
        })
        socket.on('seen-message', (data) => {
            const userindex = ConnectedUsers.findIndex(connecteduser => {
                return connecteduser.userid === data.userid
            })
            if (userindex >= 0)
                ConnectedUsers[userindex].socketIds.forEach(socketId => {
                    socket.broadcast.to(socketId).emit('seen-message', data.info)
                })
        })
        socket.on('message-received', (data) => {
            const userindex = ConnectedUsers.findIndex(connecteduser => {
                return connecteduser.userid === data.userid
            })
            if (userindex >= 0)
                ConnectedUsers[userindex].socketIds.forEach(socketId => {

                    socket.broadcast.to(socketId).emit('message-received', data.message)
                })
        })
        socket.on('user-disconnected', async (obj) => {
            const userindex = ConnectedUsers.findIndex(connecteduser => {
                return connecteduser.userid === obj.userid
            })
            if (userindex >= 0) {
                if (ConnectedUsers[userindex].socketIds.length > 1) {
                    const socketIdIndex = ConnectedUsers[userindex].socketIds.findIndex(socketId => socketId == socket.id)
                    ConnectedUsers[userindex].socketIds.splice(socketIdIndex, 1)
                } else {

                    console.log(userindex)
                    console.log(ConnectedUsers[userindex])
                    console.log('==================================')
                    const lastVisitDate = new Date().toISOString()
                    await User.updateOne({ _id: ConnectedUsers[userindex].userid }, { $set: { connection: { status: false, lastVisit: lastVisitDate } } })
                    socket.broadcast.emit('user-disconnected', { userid: ConnectedUsers[userindex].userid, lastVisit: lastVisitDate })
                    ConnectedUsers.splice(userindex, 1)

                }

            }
        })
        socket.on('call-user', (callerUserId, callReceiverId, isVideoCall) => {
            const userDestindex = ConnectedUsers.findIndex(connecteduser => {
                return connecteduser.userid === callReceiverId
            })
            const userCallerindex = ConnectedUsers.findIndex(connecteduser => {
                return connecteduser.userid === callerUserId
            })


            if (userDestindex >= 0) {
                if (ConnectedUsers[userDestindex].socketIds)
                    ConnectedUsers[userDestindex].socketIds.forEach(socketId => {
                        socket.broadcast.to(socketId).emit('call-user', callerUserId, isVideoCall)

                    })
                else
                    socket.broadcast.to(ConnectedUsers[userCallerindex].socketIdCall).emit('call-ended', callerUserId)

            }

            socket.emit('user-call-state', userDestindex >= 0)

        })
        socket.on('end-call', (callerUser, fromCaller) => {
            const userindex = ConnectedUsers.findIndex(connecteduser => {
                return connecteduser.userid === callerUser._id
            })
            if (userindex >= 0)
                if (fromCaller) {
                    ConnectedUsers[userindex].socketIds.forEach(socketId => {
                        socket.broadcast.to(socketId).emit('call-ended', callerUser)

                    })
                }
                else
                    socket.broadcast.to(ConnectedUsers[userindex].socketIdCall).emit('call-ended', callerUser)
        })
        socket.on('cameraOpenClose', (DestUserId, action) => {
            const userIndex = ConnectedUsers.findIndex(connectedUser => { return connectedUser.userid === DestUserId })
            console.log(ConnectedUsers[userIndex].userid, DestUserId)
            if (userIndex >= 0) {
                socket.broadcast.to(ConnectedUsers[userIndex].socketIdCall).emit('onCameraStateChange', action)
            }
        })
        socket.on('join-room', (roomId, userId) => {
            socket.join(roomId)
            socket.to(roomId).broadcast.emit('userConnectedToRoom', userId)
            socket.on('disconnect', () => {
                socket.to(roomId).broadcast.emit('user-disconnected-from-room', userId)

            })
        })
        socket.on('disconnect', async () => {
            const userCallindex = ConnectedUsers.findIndex(connecteduser => {
                return connecteduser.socketIdCall === socket.id
            })
            if (userCallindex >= 0) {
                ConnectedUsers[userCallindex].socketIdCall = null;
            } else {
                const userindex = ConnectedUsers.findIndex(connectedUser => {
                    return connectedUser.socketIds.includes(socket.id)
                })
                if (userindex >= 0) {
                    if (ConnectedUsers[userindex].socketIds.length > 1) {
                        const socketIdIndex = ConnectedUsers[userindex].socketIds.findIndex(socketId => socketId == socket.id)
                        ConnectedUsers[userindex].socketIds.splice(socketIdIndex, 1)
                    } else {

                        console.log(userindex)
                        console.log(ConnectedUsers[userindex])
                        console.log('==================================')
                        const lastVisitDate = new Date().toISOString()
                        await User.updateOne({ _id: ConnectedUsers[userindex].userid }, { $set: { connection: { status: false, lastVisit: lastVisitDate } } })
                        socket.broadcast.emit('user-disconnected', { userid: ConnectedUsers[userindex].userid, lastVisit: lastVisitDate })
                        ConnectedUsers.splice(userindex, 1)

                    }
                }
            }
        })
    })
})