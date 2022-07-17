
const configResponse = (req, res, next) => {
  res.success = (message, data, statusCode = 200) => {
    res.status(statusCode).json({
      status: true,
      message: message,
      ...(data !== undefined) && { data: data }
    })
  }

  res.error = (message, error, statusCode = 400) => {
    res.status(statusCode).json({
      status: false,
      message: message,
      ...(error !== undefined) && { error: error }
    })
  }

  next()
}

module.exports = configResponse
