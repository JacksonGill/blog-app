const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../model/blog')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initalBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(note => note.save())
  await Promise.all(promiseArray)
})


describe('when there is intially some blogs saved', () => {
  test('blogs are returend as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are four blogs', async () => {
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initalBlogs.length)
  })

  test('a specifc blog is within the returned blogs', async () => {
    const blogsAtEnd = await helper.blogsInDb()
    const contents = blogsAtEnd.map(blog => blog.title)
    expect(contents).toContain('Why i love cookies')
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Consider...",
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initalBlogs.length + 1)

    const contents = blogsAtEnd.map(blog => blog.title)
    expect(contents).toContain('Go To Statement Considered Harmful')
  })
})

describe('viewing /deleting a specific blog', () => {
  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
      const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
      expect(resultBlog.body).toEqual(processedBlogToView)
  })

  test('a note can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete._id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initalBlogs.length -1)

    const contents = blogsAtEnd.map(blog => blog.title)
    expect(contents).not.toContain(blogToDelete.title)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNoneExistingId = await helper.nonExistingId()

    await api
      .get(`/api/blogs/${validNoneExistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('addition of a new note', () => {
  test('if likes is missing to is atomatically set to 0', async () => {
    const newBlog = {
      title: "My name Jeff",
      author: "Bad Author",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Consider..."
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
    
    const blogsAtEnd = await helper.blogsInDb()
    const alteredblog = blogsAtEnd.find(blog => blog.author === 'Bad Author')
    expect(alteredblog.likes).toBe(0)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      author: "Bad Author",
      title: "My name jeff title",
      likes: 45
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initalBlogs.length)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: "Bad Author",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Consider...",
      likes: 45
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initalBlogs.length)
  })
})

describe('updating likes for a blog', () =>  {
  test('updating likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const testBlog = blogsAtStart.find(blog => blog.author === 'Jackson Gill')
    testBlog.likes = 1000

    await api
      .put(`/api/blogs/${testBlog._id}`)
      .send(testBlog)
      .expect(200)
  
    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(blog => blog.author === 'Jackson Gill')
    console.log(updatedBlog)
    expect(updatedBlog.likes).toBe(1000)
  })
})



afterAll(() => {
  mongoose.connection.close()
})