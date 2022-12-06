const { default: mongoose } = require('mongoose');
const service = require('../service/driverService');
const logger = require('../utils/winston');

const createErrorResponse = (error) => {
  logger.error(error);
  switch (true) {
    case error instanceof mongoose.Error.ValidationError:
      return {
        status: 401,
        body: {
          err: 'FIELDS_VALIDATION_ERROR',
          msg: 'Fields missing or with invalid format',
          fields: Object
            .entries(error.errors)
            .map((e) => e[1].path),
        },
      };
    case error instanceof mongoose.Error.CastError:
      return {
        status: 401,
        body: {
          err: 'FIELDS_VALIDATION_ERROR',
          msg: 'The id passed had an invalid format',
          fields: [error.path],
        },
      };
    case error instanceof mongoose.Error.DocumentNotFoundError:
      return {
        status: 404,
        body: {
          err: 'USER_NOT_FOUND_ERROR',
          msg: 'The driver data was not found for the id',
          fields: [error.filter],
        },
      };
    default:
      return {
        status: 500,
        body: {
          err: 'INTERNAL_SERVER_ERROR',
          msg: 'Failed to process the request',
        },
      };
  }
};

const createDriver = async (req, res) => {
  try {

    const result = await service.createDriver(
      req.params.id,
      req.body.vehicle
    );
    res.status(201).send(result);
  } catch (error) {
    const errorResponse = createErrorResponse(error);
    res.status(errorResponse.status).send(errorResponse.body);
  }
};

const getById = async (req, res) => {
  try {
    const result = await service.getById(req.params.id);
    res.status(200).send(result);
  } catch (error) {
    const errorResponse = createErrorResponse(error);
    res.status(errorResponse.status).send(errorResponse.body);
  }
};

const getAll = async (_, res) => {
  try {
    const result = await service.getAll();
    res.status(200).send(result);
  } catch (error) {
    const errorResponse = createErrorResponse(error);
    res.status(errorResponse.status).send(errorResponse.body);
  }
};

const update = async (req, res) => {
  try {
    const result = await service.update(
      // eslint-disable-next-line no-underscore-dangle
      req.body._id,
      vehicle
    );
    res.status(200).send(result);
  } catch (error) {
    const errorResponse = createErrorResponse(error);
    res.status(errorResponse.status).send(errorResponse.body);
  }
};

const rate = async (req, res) => {
  let { qualification } = req.body;
  if (qualification > 5 || qualification < 0) {
    res.status(400).send({ err: "OUT_OF_RANGE", msg: 'Qualification must be between 0 and 5' });
    return
  }
  if (req.headers.type !== 'driver') {
    res.status(400).send({ err: "INVALID_OPERATION", msg: 'User isn\'t driver' });
    return
  }
  try {
    let updated
    try {
      let result = (await service.getById(req.params.id)).toObject();

      const rate = (result.rating.rate * result.rating.count + req.body.qualification) / (result.rating.count + 1)
      const count = result.rating.count + 1;
      updated = await service.rate(req.params.id, rate, count);
    } catch (error) {
      const errorResponse = createErrorResponse(error);
      res.status(errorResponse.status).send(errorResponse.body);
    }
    res.status(200).send(updated);
  } catch (error) {
    const errorResponse = createErrorResponse(error);
    res.status(errorResponse.status).send(errorResponse.body);
  }
};

const deleteById = async (req, res) => {
  try {
    const result = await service.deleteById(req.params.id);
    res.status(200).send(result);
  } catch (error) {
    const errorResponse = createErrorResponse(error);
    res.status(errorResponse.status).send(errorResponse.body);
  }
};

const makeVIP = async (req, res) => {
  try {
    const result = (await service.getById(req.headers.user)).toObject();
    if (result.vip) {
      return res.status(400).send({ err: "INVALID_OPERATION", msg: 'User is already VIP' });
    }
    const updated = await service.makeVIP(req.headers.user);
    return res.status(200).send(updated);
  } catch (error) {
    const errorResponse = createErrorResponse(error);
    res.status(errorResponse.status).send(errorResponse.body);
  }
}

module.exports = {
  createDriver, getById, getAll, update, deleteById, rate, makeVIP
};
