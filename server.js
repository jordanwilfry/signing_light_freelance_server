const express = require('express');
const app = express();
const socketio = require("socket.io")
const http = require("http")

const server = http.createServer(app)
const io = socketio(server)

const config = require('./config');

const connection = require('./mongoConnect');
connection();

const cors = require('cors')
const multer = require('multer')
const morgan = require('morgan')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const path = require('path')

require('dotenv').config()


const AuthenticationRoute = require('./Routes/Authentication')
const PostRoute = require('./Routes/Project')
const UserRoute = require('./Routes/User')
const ConversationRoute = require('./Routes/Conversation')
const MessageRoute = require('./Routes/Message')
const SearchRoute = require('./Routes/Search')

//Passing midlewarenpm
app.use(express.json())
app.use(helmet())//help securing the request send
app.use(cors())
app.use(morgan('common'))//send in the console the detail about the request you did
app.use(cookieParser())

app.use("/images", express.static(path.join(__dirname, "public/images")));

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, "public/images/post")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    },
})

const upload = multer({storage : storage})

app.post('/upload' , upload.single("file"), (req, res)=>{
    try {
        res.status(200).json('file have been uploaded')
    } catch (error) {
        console.log(error)
    }
})

// working with socket

let users = []

const AddUser = (userId, socketId) => {
    console.log(userId);
    console.log(socketId);
    !users.some((user)=> user.userId === userId) &&
        users.push({ userId, socketId })
}

const RemoveUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)    
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };
  
  
io.on("connection", (socket) => {
//when connect

    console.log("A user connected")
    io.emit("welcome", 'hello this my socket server!')
    console.log(users);

    //taking the user_Id front the react application
    socket.on("addUserConect", (userId) => {
        AddUser(userId, socket.id)
        io.emit("getUsers", users)
    })

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        console.log(receiverId)
        console.log(user)
        io.to(user?.socketId).emit("getMessage", {
        senderId,
        text,
        });
    });


//when disconnect 
    socket.on('disconnect', ()=>{
        console.log('a user have is disconnected')
        RemoveUser(socket.id)
        io.emit("getUsers", users)
    })
})

// end socket io

app.get('/' , (req,res)=>{
    res.status(200).json('Hello')
})


app.use('/auth', AuthenticationRoute)
app.use('/user', UserRoute)
app.use('/project', PostRoute)
app.use('/conversation', ConversationRoute)
app.use('/message', MessageRoute)
app.use('/search', SearchRoute)


server.listen(config.port, (err)=>{
    if(!err){
        console.log(`Server succesfully started  on port ${config.port}`);
    }
    else{
        console.log('And error occured');
    }
})