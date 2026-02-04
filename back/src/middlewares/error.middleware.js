export default (err, req, res, next) => {
  console.error('Error:', err);

  // SQL Server specific errors
  if (err.code === 'ELOGIN') {
    return res.status(500).json({ 
      error: 'Database authentication failed',
      message: 'Unable to connect to the database. Please check your credentials.'
    });
  }

  if (err.code === 'ETIMEOUT') {
    return res.status(504).json({ 
      error: 'Database connection timeout',
      message: 'The database took too long to respond.'
    });
  }

  if (err.code === 'EREQUEST') {
    return res.status(400).json({ 
      error: 'Invalid database request',
      message: err.message || 'The database query failed.'
    });
  }

  if (err.name === 'ConnectionError') {
    return res.status(503).json({ 
      error: 'Database connection error',
      message: 'Unable to connect to the database.'
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ 
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
