const cors = require('cors');
const env = require('./env');

const allowedOrigins = [env.CLIENT_URL];

const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    if (env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);