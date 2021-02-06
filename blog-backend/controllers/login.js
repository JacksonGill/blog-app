const jwt = require("jsonwebtoken")
const bcryptjs = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../model/users')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  try {
    const correctPassword = (user === null) ? false : await bcryptjs.compare(body.password, user.passwordHash)

    if(!(user && correctPassword)) {
      return response.status(401).json({ error: 'invalid username or password' })
    }

    const userToken = {
      username: user.username,
      id: user._id
    }

    const token = jwt.sign(userToken, process.env.SECRET)
    response.status(200).send({ token, username: user.username, name: user.name })
  } catch (exception) {
    return response.status(400).send({ error: 'invalid username or password' })
  }
  
})

module.exports = loginRouter