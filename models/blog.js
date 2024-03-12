const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        minLength:5,
        required:true
    },
    author:{type:String,required:true},
    url:{type:String,required:true},
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likes:Number
})

blogSchema.set('toJSON',{
    transform:(document,recievedObj)=>{
        recievedObj.id = recievedObj._id.toString()
        delete recievedObj._id
        delete recievedObj.__v
    }
})

module.exports = mongoose.model('Blog',blogSchema)