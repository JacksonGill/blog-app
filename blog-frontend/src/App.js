import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/loginService'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const userJSON = window.localStorage.getItem('blogUser')
    if (userJSON) {
      setUser(JSON.parse(userJSON))
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('blogUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
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
  const postBlog = async (event) => {
    event.preventDefault()
    blogService.setToken(user.token)

    const blogObject = {
      title,
      author,
      url
    }

    const response = await blogService.create(blogObject)
    setBlogs(blogs.concat(response))

    setMessage(`a new blog: ${title} by ${author} added`)
    setTimeout(() => {
      setMessage(null)
    }, 4000)
    
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const loginForm = () => {
    return (
      <div>
        <h2>log in to application</h2>
        <form onSubmit={handleLogin}>
          <div> username
            <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
          </div>
          <div> password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          <button type="submit">login</button> 
        </form>
      </div>
    )
  }

  const blogView = () => {
    return (
      <div>
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button> </p>
        </div>

        <div>
          <h2>create new</h2>
          <form onSubmit={postBlog}>
            <div> title:
              <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>
            <div> author:
              <input type="text" value={author} onChange={(event) => setAuthor(event.target.value)} />
            </div>
            <div> url:
              <input type="text" value={url} onChange={(event) => setUrl(event.target.value)} />
            </div>
            <button type="submit">create</button>
          </form>
          <br />
        </div>

        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
        
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} error={error}/>
      {(user === null) ? loginForm() : blogView()}
    </div>
  )
}

export default App