const express = require('express');
const controller = require('../controllers/driverController');

const router = express.Router();

// Ping
router.get('/ping', (_, res) => 
  // #swagger.tags = ['default']
  // #swagger.description = 'Probar el servicio.'
res.status(200).send({ message: 'Pong' }));

// Create a driver
router.post('/drivers/:id', (req, res) => {
  // #swagger.tags = ['Driver']
  // #swagger.description = 'Crear un nuevo chofer.'
  controller.createDriver(req, res);
});

// Get a driver by id
router.get('/drivers/:id', (req, res) => {
  // #swagger.tags = ['Driver']
  // #swagger.description = 'Obtener un chofer.'
  controller.getById(req, res);
});

// Get all drivers
router.get('/drivers', (req, res) => {
  // #swagger.tags = ['Driver']
  // #swagger.description = 'Obtener todos los choferes.'
  controller.getAll(req, res);
});

// Update a driver
router.put('/drivers', (req, res) => {
  // #swagger.tags = ['Driver']
  // #swagger.description = 'Actualizar un chofer.'
  controller.update(req, res);
});

// Delete a driver
router.delete('/drivers/:id', (req, res) => {
  // #swagger.tags = ['Driver']
  // #swagger.description = 'Eliminar un chofer.'
  controller.deleteById(req, res);
});

// Rate a driver
router.patch('/qualification/:id', (req, res) => {
  // #swagger.tags = ['Driver']
  // #swagger.description = 'Calificar un chofer.'
  controller.rate(req, res);
});

// Delete an user
router.patch('/vip', (req, res) => {
  // #swagger.tags = ['Driver']
  // #swagger.description = 'Eliminar un chofer.'
  controller.makeVIP(req, res);
});

module.exports = router;
