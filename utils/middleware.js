const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request,response,next) => {
    logger.info('Method',request.method)
    logger.info('Body',request.body)
    logger.info('Path',request.path)
    logger.info('----')
    next()
}

const unknownEndpoint = (request,response) => {
    return response.status(404).send({error:"Unknown Endpoint"})
}

const errorHandler = (error,request,response,next) =>{
    console.log(error.name)
    if(error.name==='ValidationError'){
        return response.status(400).json({error:error.message})
    }
    else if(error.name === 'MongoServerError'&& error.message.includes('E11000 duplicate key error')){
        return response.status(400).json({error:"username must be unique"})
    }
    else if(error.name=== 'JsonWebTokenError'){
        return response.status(401).json({error:'missing or invalid token'})
    }
    next(error)

}

const tokenExtractor = (request,response,next) =>{
    const authorization = request.get('authorization')
    if(authorization&&authorization.startsWith('Bearer')){
        request.token = authorization.replace('Bearer ','')
    }
    next()
}

const userExtractor = async (request,response,next) =>{
    const tokenObj = jwt.verify(request.token,process.env.SECRET)
    if(!tokenObj.id){
        return response.status(401).json({error:"invalid token"})
    }
    const user = await User.findById(tokenObj.id)
    request.user = user
    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}