const usersRouter = require('express').Router()
const bcryptjs = require('bcryptjs')
const User = require('../model/users')

usersRouter.post('/', async (request, response) => {
  const body = request.body
  if(body.password < 2) {
    return response.status(400).json({ error: 'password must be 3 or more characters'})
  }

  const saltRounds = await bcryptjs.genSalt(10)
  const passwordHash = await bcryptjs.hash(body.password, saltRounds)
  
  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })
  
  try {
    const savedUser = await user.save()
    response.json(savedUser)
  } catch (error) {
    response.status(400).json({ error: 'invalid username requirements'})
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1})
  response.json(users)
})


module.exports = usersRouter