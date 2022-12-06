const express = require('express');
const helmet = require('helmet');
const routes = require('./routes/routes');
const morgan = require('./utils/morgan');

const app = express();

// Morgan logger
app.use(morgan);

// Header safety
app.use(helmet({ crossOriginOpenerPolicy: { policy: "unsafe-none" } }));

// Json
app.use(express.json());

// Routes
app.use('/driver', routes);

const tracer = require('dd-trace').init({
    logInjection: true,
  });

module.exports = app;
