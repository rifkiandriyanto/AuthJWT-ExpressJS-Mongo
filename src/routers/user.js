const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/users', async (request, response) => {
  // Create a new user
  try {
    const user = new User(request.body)
    await user.save()
    const token = await user.generateAuthToken()
    response.status(201).send({ user, token })
  } catch (error) {
    response.status(400).send(error)
  }
})

router.post('/users/login', async (request, response) => {
  // Login a registered user
  try {
    const { email, password } = request.body
    const user = await User.findByCredentials(email, password)
    if (!user) {
      return response
        .status(401)
        .send({ error: 'Login failed! Check authentication credentials' })
    }
    const token = await user.generateAuthToken()
    response.send({ user, token })
  } catch (error) {
    response.status(400).send(error)
  }
})

router.get('/users/me', auth, async (request, response) => {
  // View logged in user profile
  response.send(request.user)
})

router.post('/users/me/logout', auth, async (request, response) => {
  // Log user out of the application
  try {
    request.user.tokens = request.user.tokens.filter(token => {
      return token.token != request.token
    })
    await request.user.save()
    response.send()
  } catch (error) {
    response.status(500).send(error)
  }
})

router.post('/users/me/logoutall', auth, async (request, response) => {
  // Log user out of all devices
  try {
    request.user.tokens.splice(0, request.user.tokens.length)
    await request.user.save()
    response.send()
  } catch (error) {
    response.status(500).send(error)
  }
})

module.exports = router
