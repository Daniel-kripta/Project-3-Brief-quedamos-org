const errorHandler = (err, req, res, next) => {
  console.error(err)

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Resource already exist' })
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Resource not found' })
  }

  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
}

module.exports = errorHandler