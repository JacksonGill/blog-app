const blogRouter = require('express').Router()
const Blog = require('../model/blog')
const User = require('../model/users')
const jwt = require('jsonwebtoken')

blogRouter.post('/', async (request, response) => {
  const body = request.body
  const token = request.token

  if (token === null) {
    return response.status(400).json({ error: 'must be logged in to create a blog' })
  }
  
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid '})
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()
  response.json(savedBlog)
  
})

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user' , { username: 1, name: 1 })
  response.json(blogs)
})


blogRouter.get('/:id', async (request, response) => {
  try {
    const note = await Blog.findById(request.params.id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    response.status(400).end()
  }
})

blogRouter.delete('/:id', async (request, response) => {
  const token = request.token
  if (token === null) {
    return response.status(400).json({ error: 'must be logged in to delete blog'})
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)

  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() !== decodedToken.id) {
    return response.status(400).json({ error: 'must be the creator of the blog to delete' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {...body, likes: body.likes}
  
  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(blog)
})

module.exports = blogRouter