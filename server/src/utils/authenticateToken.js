const jwt = require('jsonwebtoken');
const createError = require('http-errors')

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null)
    return next(createError(401))

  jwt.verify(token, process.env.TOKEN_SECRET, (error, payload) => {

    if (error) {
      console.log(error.message)
      return next(createError(401))
    }

    req.user = payload?.user
    req.role = payload?.role
    next()
  })
}

module.exports = authenticateToken