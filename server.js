require ('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const { file } = require('googleapis/build/src/apis/file')
const res = require('express/lib/response')
const path = require('path')

const methodOverride = require('method-override');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const crypto = require('crypto');

const Comments = require('./models/comment')

const app= express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true
}))

// Connect to MongoDB
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    //useCreateIndex: true,
    //useFindandModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err=>{
    if(err) throw err;
    console.log("Connected to mongodb")
})

const http= require('http').createServer(app)
const io= require('socket.io')(http)

io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

// Socket io
let users = []
io.on('connect', socket => {
    console.log(socket.id + ' connected.')

    socket.on('joinRoom', id => {
        const user = {userId: socket.id, room: id}

        const check = users.every(user => user.userId !== socket.id)

        if(check){
            users.push(user)
            socket.join(user.room)
        }else{
            users.map(user => {
                if(user.userId === socket.id){
                    if(user.room !== id){
                        socket.leave(user.room)
                        socket.join(id)
                        user.room = id
                    }
                }
            })
        }

        console.log(users)
        console.log(socket.adapter.rooms)

    })

    socket.on('createComment', async msg => {

        console.log(msg)
        const {username, content, book_id, createdAt, rating, send} = msg

        const newComment = new Comments({
            username, content, book_id, createdAt, rating
        })

        if(send === 'replyComment'){
            const {_id, username, content, book_id, createdAt, rating} = newComment

            const comment = await Comments.findById(book_id)

            if(comment){
                comment.reply.push({_id, username, content, createdAt, rating})
                await comment.save()
                io.to(comment.book_id).emit('sendReplyCommentToClient', comment)
            }
        }else{
            await newComment.save()
            io.to(newComment.book_id).emit('sendCommentToClient', newComment)
        }

        
    })

    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnected.')
        //socketCleanup();
        //socket.socket.reconnect();
        users = users.filter(user => user.id!== socket.id)
    })
})

// create storage engine
const storage = new GridFsStorage({
    url: URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

// Routes
app.use('/api', require('./routes/userRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/genreRouter'))
app.use('/api', require('./routes/bookRouter'))
app.use('/api', require('./routes/commentRouter'))
app.use('/api', require('./routes/blogRouter'))
app.use('/api', require('./routes/paymentRouter'))

const upload = multer({ storage });
const pdfRouter = require('./routes/pdfRouter');
app.use('/api', pdfRouter(upload))

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res)=>{
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 5000
http.listen(PORT, ()=>{
    console.log('Server is running on port', PORT)
})
