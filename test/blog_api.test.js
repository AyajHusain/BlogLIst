const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')
const api = supertest(app)

beforeAll(async()=>{
    await User.ensureIndexes()
})

beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('cleared')
    for(let blog of helper.initialBlogs){
        let blogObject = new Blog(blog)
        await blogObject.save()
        console.log('saved')
    }
    console.log('done')
})

describe('getting blogs',()=>{
    test('getting all blogs',async () =>{
        const response = await api
                                .get('/api/blogs')
                                .expect(200)
                                .expect('Content-type',/application\/json/)
                                .timeout(10000)
        console.log(response.body[0])
    })


    test ('all blogs are returned as json',async()=> {
        const response = await api.get('/api/blogs')
        
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    },10000)

})


describe('saving blogs',()=>{
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFyc2giLCJpZCI6IjY1ZGY1ODE3MjhkYjI0OWM0NWQ2YzViOCIsImlhdCI6MTcwOTEzNjIyOH0.kFIL7hZicLS3JGoZkASTXK4KT7wKhq8J-9hb3YHaZF4'

    test('with token',async()=>{
        const blog = {
            title:"Third Blog",
            author:"Ikra khan",
            likes:0,
            url:"https://firstsiteguide.com/best-blogging-platforms/"
        }
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFyc2giLCJpZCI6IjY1ZGY1ODE3MjhkYjI0OWM0NWQ2YzViOCIsImlhdCI6MTcwOTEzNjIyOH0.kFIL7hZicLS3JGoZkASTXK4KT7wKhq8J-9hb3YHaZF4'

        const response = await api
                            .post('/api/blogs')
                            .send(blog)
                            .set('authorization',`Bearer ${token}`)
                            .expect(201)
                            .expect('Content-type',/application\/json/)
    
        expect(response.body.author).toContain(blog.author)
    
        const blogs = await Blog.find({})
        expect(blogs).toHaveLength(helper.initialBlogs.length+1)
    },10000)

    test('without title',async()=>{
        const blog = {
            author:"John",
            likes:0,
            url:"https://chat.openai.com/c/4a6b6f55-fc4d-4e00-9e2a-53a9060e9def"
        }
    
        await api
            .post('/api/blogs')
            .send(blog)
            .set('authorization',`Bearer ${token}`)
            .expect(400)
    },10000)

    test('without token',async()=>{
        const blog = {
            title:"Third Blog",
            author:"Ikra khan",
            likes:0,
            url:"https://firstsiteguide.com/best-blogging-platforms/"
        }
        await api
        .post('/api/blogs')
        .send(blog)
        .expect(401)
    },10000)
})


describe('checking id and likes',()=>{
    test('verifying unique identifier of blogs',async ()=>{
        const response = await api.get('/api/blogs')
        response.body.forEach(blog=>{
            expect(blog.id).toBeDefined()
        })
     },10000)

     test('is like property defined', async()=>{
        const response = await api.get('/api/blogs')
        response.body.forEach(blog=>{
            expect(blog.likes).toBeDefined()
        })
       
    })
})


describe('deleting',()=>{
    test('deleting blog',async ()=>{
        const blogs = await helper.blogsInDb()
        blogsToDelete = blogs[0]
        await api
            .delete(`/api/blogs/${blogsToDelete.id}`)
            .expect(204)
    })
})


describe('update',()=>{
    test('updating blog',async()=>{
        const blogs = await helper.blogsInDb()
        blogToUpdate = blogs[0]
        const updatedBlog = {
            title:'updated blog',
            likes:3
        }
        await api   
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(updatedBlog)
                .expect(200)
                            
        const blogsAfterUpdate = await helper.blogsInDb()
        const titles = blogsAfterUpdate.map(blog=>blog.title)
        expect(titles).toContain(updatedBlog.title)   
            
    },10000)
})

describe('adding user',()=>{
    test('adding invalid user',async()=>{

        const user = {
            name:'ayaj husain',
            username:'ayaj',
            password:'shjhht'
        }

        const response = await api
                        .post('/api/users')
                        .send(user)
                        .expect(400)
                        .expect('Content-type',/application\/json/)
        
        expect(response.body.error).toBe('username must be unique')

    },10000)

    test('adding valid user',async()=>{
        const user = {
            name:"Arsh Husain",
            username:"Arsh",
            password:"skeleton"
        }
        await api
        .post('/api/users')
        .send(user)
        .expect(201)
    })
})

test('getting token',async()=>{
    const body = {
        username:"Arsh",
        password:"skeleton"
    }
    const response = await api
    .post('/api/login')
    .send(body)
    .expect(200)

    expect(response.body).toBe('something good')
},10000)

afterAll(async()=>{
    await mongoose.connection.close()
    console.log('connection closed')
})