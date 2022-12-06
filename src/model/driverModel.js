const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const Driver = model('Driver', new Schema({
  _id: String,
  vehicle: {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    plate: {
      type: String,
      required: true,
    }
  },
  rating: {
    rate: {
      type: Number,
      default: 5.0,
    },
    count: {
      type: Number,
      default: 1,
    },
  },
  vip: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true,
  collection: 'drivers',
}));

module.exports = Driver;
