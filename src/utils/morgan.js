const morgan = require('morgan');
require('dotenv').config();
const logger = require('./winston');

const stream = {
  // Use the http severity
  write: (message) => logger.http(message.trim()),
};

const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

const morganLogger = morgan(
  // Define message format string (this is the default one).
  // The message format is made from tokens, and each token is
  // defined inside the Morgan library.
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  { stream, skip },
);

module.exports = morganLogger;
