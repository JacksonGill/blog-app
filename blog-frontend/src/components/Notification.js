import React from 'react'

const Notification = ({ message, error }) => {
  if (message === null) {
    return null
  }
  if (error) {
    return (
      <div className="error">
        <p>{message}</p>
      </div>
    )
  }
  return (
    <div className="success">
      <p>{message}</p>
    </div>
  )
  
}

export default Notification