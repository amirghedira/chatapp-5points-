const http = require('http');
const app = require('./app')
const server = http.createServer(app)
const io = require('socket.io')(server);
const jwt = require('jsonwebtoken')
const ConnectedUsers = [];
server.listen(process.env.PORT || 5000, () => {

    io.on('connection', (socket) => {

        socket.on('connectuser', (token) => {
            try {
                let user = jwt.verify(token, process.env.JWT_SECRET_KEY)
                if (user) {
                    const userindex = ConnectedUsers.findIndex(connecteduser => {
                        return connecteduser.userid === user._id
                    })
                    if (userindex < 0)
                        ConnectedUsers.push({ userid: user._id, socketid: socket.id })

                }
            } catch (error) {
                console.log('error')
            }
        })
        socket.on('useradded', (newUser) => {
            socket.broadcast.emit('useradded', newUser)
        })
        socket.on('send-message', (data) => {
            const userindex = ConnectedUsers.findIndex(connecteduser => {
                return connecteduser.userid === data.userid
            })
            if (userindex >= 0)
                socket.broadcast.to(ConnectedUsers[userindex].socketid).emit('send-message', data.message)
        })
        socket.on('users', () => {
            console.log(ConnectedUsers)
        })
        socket.on('disconnect', () => {

            const userindex = ConnectedUsers.findIndex(connecteduser => {
                return connecteduser.socketid === socket.id
            })
            if (userindex >= 0)
                ConnectedUsers.splice(userindex, 1)

        })
    })
})