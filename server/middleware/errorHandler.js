class ApiError extends Error {
  constructor(statusCode = 500, message = 'Internal server error', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new ApiError(404, 'Resource not found');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = new ApiError(400, `${field} already exists`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = {};
    Object.keys(err.errors).forEach((key) => {
      details[key] = err.errors[key].message;
    });
    error = new ApiError(400, 'Validation failed', details);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired');
  }

  const statusCode = error.statusCode || (err.statusCode || 500);

  res.status(statusCode).json({
    success: false,
    error: error.message || 'Internal server error',
    ...(error.details ? { details: error.details } : {}),
    ...(process.env.NODE_ENV === 'development' && statusCode === 500
      ? { stack: err.stack }
      : {})
  });
};

module.exports = { ApiError, notFound, errorHandler };