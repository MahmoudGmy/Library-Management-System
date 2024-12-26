require('dotenv').config()
const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const bookRoutes = require('./routes/books.route')
const memberRouter = require('./routes/member.route')

app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public'))); 
const verifyToken = require('./middliewares/veryfiyToken')

const memberController = require('./controllers/member.controller')




const corsOptions = {
    origin: 'http://localhost:8000', 
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));



app.use('/api/auth',memberRouter)
app.use(express.static(path.join(__dirname, 'public')));


// app.delete('/api/users/:Id',verifyToken,memberController.deleteUser)
app.use(express.static(path.join(__dirname, 'public')));



app.use('/api/books',bookRoutes)
app.use(express.static(path.join(__dirname, 'public')));













const port = process.env.PORT||8080
app.listen(port,()=>{
    console.log(`app lisitin in Port ${port}`)
})