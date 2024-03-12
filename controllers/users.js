const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/',async (request,response)=>{
    const users = await User.find({}).populate('blogs',{url:1,title:1,author:1})
    response.status(200).json(users)
})

userRouter.post('/',async(request,response)=>{
    const {username,name,password} = request.body
    
    if(password.length<3){
        return response.status(400).json({error:"too short password"})
    }

    const saltRound = 10
    const passwordHash = await bcrypt.hash(password,saltRound)

    const user = new User ({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = userRouter