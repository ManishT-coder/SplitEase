// Environment configuration with sensible defaults for local development
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGODB_URI:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/splitease',
  JWT_SECRET: process.env.JWT_SECRET || 'splitease-super-secret-key-change-me',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || ''
};

module.exports = env;