const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');

const logger = require('./utils/winston');

const port = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    () => app.listen(port, () => {
      logger.info(`server starting in port ${port}`);
    }),
  )
  .catch((error) => {
    logger.error(`server failed to start: ${error}`);
  });
