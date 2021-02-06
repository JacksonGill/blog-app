import React, { useState } from 'react'

const BlogForm = ({ postBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    postBlog({
      title,
      author,
      url

    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <div>
        <h2>create new</h2>
        <form onSubmit={addBlog}>
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
      </div>
    </div>
  )
}

export default BlogForm