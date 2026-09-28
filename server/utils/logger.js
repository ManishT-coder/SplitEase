const env = require('../config/env');

const getTimestamp = () => new Date().toISOString();

const formatMessage = (level, message) => {
  const line = `[${getTimestamp()}] [${level.toUpperCase()}] ${message}`;
  return line;
};

const logger = {
  info: (message, ...args) => {
    if (env.NODE_ENV !== 'test') {
      console.log(formatMessage('info', message), ...args);
    }
  },
  warn: (message, ...args) => {
    console.warn(formatMessage('warn', message), ...args);
  },
  error: (message, ...args) => {
    console.error(formatMessage('error', message), ...args);
  }
};

module.exports = logger;