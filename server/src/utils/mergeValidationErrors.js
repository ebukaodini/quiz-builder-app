const mergeValidationErrors = (errors) => {
  const error = {}
  errors.forEach(err => (
    error[err.param]
      ? error[err.param].push(err.msg)
      : error[err.param] = [err.msg])
  )
  return error
}

module.exports = mergeValidationErrors