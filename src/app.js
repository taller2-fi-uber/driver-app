const tracer = require('dd-trace').init({
  logInjection: true,
});

const express = require('express');
const helmet = require('helmet');
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
const routes = require('./routes/routes');
const morgan = require('./utils/morgan');

const app = express();

// Morgan logger
app.use(morgan);

// Header safety
app.use(helmet({ crossOriginOpenerPolicy: { policy: "unsafe-none" } }));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

// Json
app.use(express.json());

// Routes
app.use('/driver', routes);

module.exports = app;
