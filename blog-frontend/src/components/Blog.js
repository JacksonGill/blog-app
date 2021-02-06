import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, blogs, setBlogs, delBlog }) => {
  const blogStyle = {
    margin: 30,
  }

  const blurStyle = {
    opacity: 1
  }

  const setBlur = () => {
    blurStyle.opacity = 0.5
  }

  const [view, setView] = useState(false)

  const addLike = async () => {
    const blogObject = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    
    const updatedBlog = await blogService.update(blogObject)
    setBlogs(blogs.map(blog => (blog.id === updatedBlog.id) ? updatedBlog : blog))
  }

  const removeBlog = () => {
    delBlog({
      ...blog,
      user: blog.user.id
    })
  }

  const detailedView = () => {
    return (
      <div style={blogStyle}>
        <p style={{margin: 0}}>{blog.url}</p>
        <p style={{margin: 0}}>{blog.likes}<button onClick={addLike}>like</button></p>
        <p style={{margin: 0}}>{blog.author}</p>
        <button onClick={removeBlog}>remove</button>
      </div>
    )
  }

  return (
    <div>
      <b style={blurStyle}>{blog.title}, by {blog.author}</b>
      <button onClick={()=> setView(!view)}>{view ? 'hide' : 'view'}</button>
      {view ? detailedView() : setBlur()}
    </div>
  )
  
}

export default Blog
