const express = require('express')

const bodyParser = require('body-parser')
const livereload = require('livereload')
const connectLiveReload = require('connect-livereload')
var cookies = require("cookie-parser");
const moment = require('moment');
const path = require('path')
const fileUpload = require('express-fileupload');


require('dotenv').config()
const app = express()
const logger = require('morgan')
const middlewares = require('./middleware/index')
const port = process.env.PORT || 3000 // default port
app.set('view engine', 'ejs') // use ejs
app.use(bodyParser.urlencoded({ extended: true })) // can use post data
app.use(express.static('public')) // add public folder
app.use(logger('combined'))
app.use(express.json())
app.use(cookies());
app.use(fileUpload());
app.locals.moment = moment;
//Livereload code
const liveReloadServer = livereload.createServer()
liveReloadServer.watch(path.join(__dirname, 'public'))
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/')
  }, 100)
})
app.use(connectLiveReload())

app.use('/', require('./routes/app'))
app.use('/auth', require('./routes/auth'))
app.use('/post', require('./routes/post'))
app.use('/comment', require('./routes/comment'))
app.use('/friends', require('./routes/friends'))
app.use('/users', require('./routes/users'))

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

app.listen(port)
console.log('Server is listening on port 3000')
