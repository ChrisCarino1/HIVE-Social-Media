const express = require("express");
const app = express();
const cors = require('cors') 
const cookieParser = require('cookie-parser')
const socket = require('socket.io')
const port = 8000;

require("./config/mongoose.config");
require('dotenv').config()
app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json(), express.urlencoded({ extended: true }));
app.use(cookieParser())

const commentRoutes = require("./routes/comment.routes");
const postRoutes = require("./routes/post.routes");
const userRoutes = require("./routes/user.routes");
const followRoutes = require("./routes/follow.routes");
const chatRoutes = require("./routes/chat.routes");
const messageRoutes = require("./routes/message.routes");

userRoutes(app);
postRoutes(app);
commentRoutes(app);
followRoutes(app);
chatRoutes(app);
messageRoutes(app)

const server = app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})

const io = socket(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['*'],
        credentials: true,
    }
})

let users = []
io.on("connection", socket => {
    console.log('socket id: ' + socket.id);

    socket.on('disconnect', () => {
        console.log('User Disconnected')
    })

    socket.on('join-server', username => {
        console.log("Username:", username)
        let newUser = {id:socket.id, username:username}
        users.push(newUser)
        console.log(users)
        // socket.broadcast.emit()

        io.emit('new-user-joined', users)

    socket.on('send-message', data => {
        console.log(data)
        io.emit('send-message-to-all-clients', data)
    })

    })
});

