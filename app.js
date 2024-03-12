const express = require('express')
require('express-async-errors')
const app = express()
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

mongoose.set('strictQuery',false)

logger.info('connecting to',config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(()=>{
        logger.info('Connected to MONGODB')
    })
    .catch(error => {
        logger.error('error connecting to MONGODB',error.message)
    })

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs',blogRouter)
app.use('/api/users',userRouter)
app.use('/api/login',loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app