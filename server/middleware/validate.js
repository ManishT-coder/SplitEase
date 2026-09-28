const { ApiError } = require('./errorHandler');

const validate = (schema) => (req, res, next) => {
  const details = {};
  Object.keys(schema).forEach((field) => {
    const rules = schema[field];
    const value = req.body[field];

    if (rules.required && (value === undefined || value === null || value === '')) {
      details[field] = rules.message || `${field} is required`;
    } else if (value !== undefined && value !== null && value !== '') {
      if (rules.type === 'number' && typeof value !== 'number') {
        details[field] = `${field} must be a number`;
      } else if (rules.type === 'array' && !Array.isArray(value)) {
        details[field] = `${field} must be an array`;
      } else if (
        rules.type === 'email' &&
        !/^\S+@\S+\.\S+$/.test(String(value))
      ) {
        details[field] = 'Please provide a valid email';
      } else if (rules.minLength && String(value).length < rules.minLength) {
        details[field] = `Minimum ${rules.minLength} characters required`;
      }
    }
  });

  if (Object.keys(details).length > 0) {
    return next(new ApiError(400, 'Invalid input data', details));
  }

  next();
};

module.exports = validate;