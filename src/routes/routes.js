const express = require('express');
const controller = require('../controllers/driverController');

const router = express.Router();

// Ping
router.get('/ping', (_, res) => res.status(200).send({ message: 'Pong' }));

// Create a driver
router.post('/drivers', (req, res) => {
  controller.createDriver(req, res);
});

// Get a driver by id
router.get('/drivers/:id', (req, res) => {
  controller.getById(req, res);
});

// Get all drivers
router.get('/drivers', (req, res) => {
  controller.getAll(req, res);
});

// Update a driver
router.put('/drivers', (req, res) => {
  controller.update(req, res);
});

// Delete a driver
router.delete('/drivers/:id', (req, res) => {
  controller.deleteById(req, res);
});

// Rate a driver
router.patch('/qualification/:id', (req, res) => {
  controller.rate(req, res);
});

module.exports = router;
