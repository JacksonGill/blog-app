import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/loginService'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  const ToggableVisibility = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort((a,b) => (a.likes > b.likes) ? -1 : 1)
      setBlogs(sortedBlogs) 
    })
  }, [])

  useEffect(() => {
    const userJSON = window.localStorage.getItem('blogUser')
    if (userJSON) {
      setUser(JSON.parse(userJSON))
    }
  }, [])

  const postBlog = async (blog) => {
    blogService.setToken(user.token)

    const response = await blogService.create(blog)
    setBlogs(blogs.concat(response))
    ToggableVisibility.current.changeVisibility()

    setMessage(`a new blog: ${blog.title} by ${blog.author} added`)
    setTimeout(() => {
      setMessage(null)
    }, 4000)
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ 
        username, 
        password
      })

      window.localStorage.setItem('blogUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
    } catch (excpetion) {
      setError(true)
      setMessage('wrong username or password')
      setTimeout(() => {
        setError(null)
        setMessage(null)
      }, 4000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('blogUser')
    setMessage(`${user.name}, you are logged out`)
    setTimeout(() => {
      setMessage(null)
    }, 4000)
    setUser(null)
  }

  const delBlog = async (blogObject) => {
    blogService.setToken(user.token)

    if (window.confirm(`Remove blog, ${blogObject.title} by ${blogObject.author}`)) {
      const deletedBlog = await blogService.deleteBlog(blogObject)
      setBlogs(blogs.filter(blog => blog.id !== deletedBlog.id))
    }
  }
  
  const loginForm = () => {
    return (
      <LoginForm 
        handleLogin={handleLogin}
      />
    )
  }

  const blogView = () => {
    return (
      <>
      <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button> </p>
      </div>
      <Togglable buttonLabel="new note" ref={ToggableVisibility}>
        <BlogForm 
          postBlog={postBlog}
        />
      </Togglable>
    </>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} error={error}/>
      
      {(user === null) ? loginForm(): blogView()}
      {blogs.map(blog =>
          <Blog blogs={blogs} setBlogs={setBlogs} delBlog={delBlog} key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App