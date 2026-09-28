const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const env = require('./config/env');
const connectDB = require('./config/db');
const corsOptions = require('./config/cors');
const routes = require('./routes');
const { apiLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

app.use(helmet());
app.use(compression());
app.use(corsOptions);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api', apiLimiter, routes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    logger.info(
      `SplitEase API running in ${env.NODE_ENV} mode on port ${env.PORT}`
    );
  });

  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

if (env.NODE_ENV !== 'test') {
  start();
}

module.exports = app;