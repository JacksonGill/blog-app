const Blog = require('../model/blog')

const initalBlogs = [
  {
    title: "Why i love cookies",
    author: "Jackson Gill",
    url: "https://www.allrecipes.com/recipes/362/desserts/cookies/",
    likes: 400
  },
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'mynamjeff', url: 'google.com', likes: 69})
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initalBlogs,
  nonExistingId,
  blogsInDb
}