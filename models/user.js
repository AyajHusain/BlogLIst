const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const userSchema = new mongoose.Schema({
    name:String,
    username:{
        type:String,
        minLength:3,
        required:true,
        unique:true
    },
    blogs:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Blog'
        }
    ],
    passwordHash:{
        type:String,
        required:true
    }
})

userSchema.set('toJSON',{
    transform:(document,recievedObj)=>{
        recievedObj.id = recievedObj._id.toString()
        delete recievedObj._id
        delete recievedObj.__v
        delete recievedObj.passwordHash
    }
})

const User = mongoose.model('User',userSchema)
module.exports = User