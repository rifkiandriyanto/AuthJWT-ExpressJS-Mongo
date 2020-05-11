const JWT = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (request, response, next) => {
  const token = request.header('Authorization').replace('S3CR3T K3Y', '')
  const data = JWT.verify(token, process.env.JWT_KEY)
  try {
    const user = await User.findOne({ _id: data._id, 'tokens.token': token })
    if (!user) {
      throw new Error()
    }
    request.user = user
    request.token = token
    next()
  } catch (error) {
    response.status(401).send({ error: 'Not authorized to access this resource' })
  }
}

module.exports = auth
