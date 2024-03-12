const Blog  = require('../models/blog')
const blogRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')


blogRouter.get('/',async (request,response)=>{
    const blogs = await Blog.find({}).populate('user',{username:1,name:1})
    response.status(200).json(blogs)
})


blogRouter.post('/',middleware.userExtractor, async (request,response) => {
  
  const body = request.body
  const user = request.user
  
  const blog = new Blog({
    ...body,
    user:user._id
  })
  const result = await blog.save()

  user.blogs = user.blogs.concat(result.id)
  await user.save()
  response.status(201).json(result)
   
})

blogRouter.delete('/:id',middleware.userExtractor,async(request,response)=>{
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if(blog.user.toString()===user._id.toString()){
    await Blog.findByIdAndDelete(blog._id)
    return response.status(204).end()
  }
  else{
    return response.status(400).json({error:"Don't have access"})
  }
   
})

blogRouter.put('/:id',async(request,response)=>{
  const body = request.body
 
  const updateBlog = await Blog
                            .findByIdAndUpdate(
                              request.params.id,
                              body,
                              {
                                new:true,
                                runValidators:true,
                                context:'query'
                              })
  response.json(updateBlog)
})


module.exports = blogRouter