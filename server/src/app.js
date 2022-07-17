const express = require('express')
const createError = require('http-errors')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const configResponse = require('./utils/configResponse')
const authenticateToken = require('./utils/authenticateToken')
require('dotenv').config()

const app = express();

// connect to database
const url = process.env.NODE_ENV === 'test'
  ? process.env.MONGODB_CONNECTION_URL_TEST
  : process.env.MONGODB_CONNECTION_URL

mongoose.connect(url)
  .then(() => {
    console.log(`🌥  Connected to MongoDB: ${mongoose.connection.name}`)
  })
  .catch(err => {
    console.log(err.message)
    process.exit()
  });

app.use(configResponse)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
// app.use('/quiz', authenticateToken, () => { })

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  return res.error(
    req.app.get('env') === 'development'
      ? err.message : 'Server Error! Please try again.',
    undefined, err.status || 500
  )
})

module.exports = app;
