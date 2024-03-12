const Blog = require("../models/blog")
const User = require('../models/user')


const initialBlogs = [
    {
        title:"First Blog",
        author:"Ayaj Husain",
        likes:0,
        url:"https://zapier.com/blog/best-blog-sites/",

    },
    {
        title:"Second Blog",
        author:"Arsh Husain",
        likes:0,
        url:"https://zapier.com/blog/selecting-apps/"
    }
]

const blogsInDb = async ()=>{
    const blogs = await Blog.find({})
    return blogs
}

module.exports = {blogsInDb,initialBlogs}