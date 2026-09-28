const success = (res, payload = {}, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    ...payload
  });
};

const error = (res, statusCode = 500, message = 'Internal server error', details = null) => {
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(details ? { details } : {})
  });
};

module.exports = { success, error };