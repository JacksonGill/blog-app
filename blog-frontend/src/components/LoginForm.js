import React, { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  LoginForm.propTypes = {
    handleLogin: PropTypes.func.isRequired,
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin({
      username,
      password
    })
    setPassword('')
    setUsername('')
  }

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleSubmit}>
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

export default LoginForm