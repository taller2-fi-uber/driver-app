const { default: mongoose } = require('mongoose');
const Driver = require('../model/driverModel');

// Creates a Driver
const createDriver = async (
  id,
  vehicle
) => Driver.create(new Driver({
  id,
  vehicle
}));

// Returns a Driver by its id
const getById = async (id) => {
  const result = await Driver.findById(id);
  if (result == null) {
    throw new mongoose.Error.DocumentNotFoundError(id);
  }
  return result;
};

// Returns all Drivers
const getAll = async () => Driver.find({});

// Update a Driver
const update = async (
  id,
  vehicle
) => {
  const filter = {
    _id: id,
  };
  const updateFields = {
    vehicle
  };
  const result = await Driver.findByIdAndUpdate(filter, updateFields);
  if (result == null) {
    throw new mongoose.Error.DocumentNotFoundError(id);
  }
  return result;
};

// Delete a Driver
const deleteById = async (id) => Driver.deleteOne({ _id: id });

// Rate Driver
const rate = async (_id, rate, count) => {
  const updateFields = {
    rating: {
      rate: rate,
      count: count
    }
  };
  const result = Driver.findByIdAndUpdate(_id, updateFields);
  if (result == null) {
    throw new mongoose.Error.DocumentNotFoundError(_id);
  }
  return result;
};

module.exports = {
  createDriver, getById, getAll, update, deleteById, rate
};
