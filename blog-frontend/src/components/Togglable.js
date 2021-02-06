import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(false)

  const visible = {display: ((isVisible) ? '' : 'none')}
  const notVisible = {display: ((isVisible) ? 'none' : '')}

  Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
  }

  const changeVisibility = () => {
    setIsVisible(!isVisible)
  }

  useImperativeHandle(ref, () => {
    return {
      changeVisibility
    }
  })

  return (
    <div>
      <div style={visible}>
        {props.children}
        <button onClick={changeVisibility}>cancel</button>
      </div>
      <div style={notVisible}>
        <button onClick={changeVisibility}>{props.buttonLabel}</button>
      </div>
    </div>
  )
})

export default Togglable