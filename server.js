const express = require('express');
const app = express();

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

app.get('/' , (req,res)=>{
    res.status(200).json('Hello')
})


app.use('/auth', AuthenticationRoute)
app.use('/user', UserRoute)
app.use('/project', PostRoute)
app.use('/conversation', ConversationRoute)
app.use('/message', MessageRoute)
app.use('/search', SearchRoute)


app.listen(config.port, (err)=>{
    if(!err){
        console.log(`Server succesfully started  on port ${config.port}`);
    }
    else{
        console.log('And error occured');
    }
})