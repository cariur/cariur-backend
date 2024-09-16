// middlewares/errorMiddleware.js
const logger = require('../config/logger');

const errorMiddleware = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
};

module.exports = errorMiddleware;
