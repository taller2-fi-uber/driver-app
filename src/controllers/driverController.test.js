jest.mock('../service/userService');
const httpMocks = require('node-mocks-http');
const mongoose = require('mongoose');
const service = require('../service/userService');
const controller = require('./userController');

// Create
describe('When a field is missing, createUser', () => {
  it('should return an error messages with the missing fields', async () => {
    service.createUser.mockImplementation(() => {
      const err = new mongoose.Error.ValidationError();
      err.errors = {
        birthDate: {
          path: 'birthDate',
        },
        lastName: {
          path: 'lastName',
        },
      };
      throw err;
    });
    const req = httpMocks.createRequest(
      {
        body: {
          name: 'TestName',
          addresses: [
            {
              name: 'TestAddressName',
              lat: 'TestLat',
              long: 'TestLong',
            },
          ],
        },
      },
    );

    const res = httpMocks.createResponse();
    await controller.createUser(req, res);

    // eslint-disable-next-line no-underscore-dangle
    const body = res._getData();
    expect(res.statusCode).toBe(401);
    expect(body.msg).toBe('Fields missing or with invalid format');
    expect(body.fields).toEqual(
      [
        'birthDate',
        'lastName',
      ],
    );
  });
});

describe('When all fields are present, createUser', () => {
  it('should return an success response', async () => {
    service.createUser.mockImplementation(() => ({
      _id: 'TestID',
      name: 'TestName',
      lastName: 'TestLastName',
      birthDate: '2012-04-23T18:25:43.511Z',
      addresses: [
        {
          name: 'TestAddressName',
          lat: 'TestLat',
          long: 'TestLong',
          _id: 'TestID',
        },
      ],
      rating: 5.0,
    }));
    const req = httpMocks.createRequest(
      {
        body: {
          name: 'TestName',
          lastName: 'TestLastName',
          birthDate: '2012-04-23T18:25:43.511Z',
          addresses: [
            {
              name: 'TestAddressName',
              lat: 'TestLat',
              long: 'TestLong',
            },
          ],
        },
      },
    );

    const res = httpMocks.createResponse();
    await controller.createUser(req, res);

    // eslint-disable-next-line no-underscore-dangle
    const body = res._getData();
    expect(res.statusCode).toBe(201);
    // eslint-disable-next-line no-underscore-dangle
    expect(body._id).toBe('TestID');
    expect(body.name).toBe('TestName');
    expect(body.lastName).toBe('TestLastName');
    expect(body.birthDate).toBe('2012-04-23T18:25:43.511Z');
    expect(body.rating).toBe(5.0);
    expect(body.addresses).toEqual([
      {
        name: 'TestAddressName',
        lat: 'TestLat',
        long: 'TestLong',
        _id: 'TestID',
      },
    ]);
  });
});

// Read
describe('When no users are present, getById', () => {
  it('should return an error', async () => {
    service.getById.mockImplementation(() => {
      throw new mongoose.Error.DocumentNotFoundError(123456789012);
    });
    const req = httpMocks.createRequest({
      params: {
        id: 123456789012,
      },
    });

    const res = httpMocks.createResponse();
    await controller.getById(req, res);

    // eslint-disable-next-line no-underscore-dangle
    const body = res._getData();
    expect(res.statusCode).toBe(404);
    expect(body.msg).toBe('The user data was not found for the id');
    expect(body.fields[0]).toBe(req.params.id);
  });
});

describe('When there is an user, getById', () => {
  it('should return the appropriate user', async () => {
    service.getById.mockImplementation(() => ({
      _id: 'TestID',
      name: 'TestName',
      lastName: 'TestLastName',
      birthDate: '2012-04-23T18:25:43.511Z',
      addresses: [
        {
          name: 'TestAddressName',
          lat: 'TestLat',
          long: 'TestLong',
          _id: 'TestID',
        },
      ],
      rating: 5.0,
    }));
    const req = httpMocks.createRequest({
      params: {
        id: 'TestID',
      },
    });

    const res = httpMocks.createResponse();
    await controller.getById(req, res);

    // eslint-disable-next-line no-underscore-dangle
    const body = res._getData();
    expect(res.statusCode).toBe(200);
    // eslint-disable-next-line no-underscore-dangle
    expect(body._id).toBe(req.params.id);
    expect(body.name).toBe('TestName');
    expect(body.lastName).toBe('TestLastName');
    expect(body.birthDate).toBe('2012-04-23T18:25:43.511Z');
    expect(body.addresses[0].name).toBe('TestAddressName');
    expect(body.addresses[0].lat).toBe('TestLat');
    expect(body.addresses[0].long).toBe('TestLong');
    expect(body.rating).toBe(5.0);
  });
});

describe('When no users are present, getAll', () => {
  it('should return an empty array', async () => {
    service.getAll.mockImplementation(() => []);

    const res = httpMocks.createResponse();
    await controller.getAll(null, res);

    // eslint-disable-next-line no-underscore-dangle
    const body = res._getData();
    expect(res.statusCode).toBe(200);
    expect(body).toEqual([]);
  });
});

// Update
describe('When no users are present, update', () => {
  it('should return an error', async () => {
    service.update.mockImplementation(() => {
      throw new mongoose.Error.DocumentNotFoundError('TestID');
    });
    const req = httpMocks.createRequest(
      {
        body: {
          id: 'TestID',
          name: 'TestName2',
          lastName: 'TestLastName',
          birthDate: '2012-04-23T18:25:43.511Z',
          addresses: [
            {
              name: 'TestAddressName',
              lat: 'TestLat',
              long: 'TestLong',
            },
          ],
          rating: 5.0,
        },
      },
    );

    const res = httpMocks.createResponse();
    await controller.update(req, res);

    // eslint-disable-next-line no-underscore-dangle
    const body = res._getData();
    expect(res.statusCode).toBe(404);
    expect(body.msg).toBe('The user data was not found for the id');
    expect(body.fields[0]).toBe('TestID');
  });
});

describe('When the user was found, update', () => {
  it('should return the old document', async () => {
    service.update.mockImplementation(() => ({
      _id: 'TestID',
      name: 'TestName',
      lastName: 'TestLastName',
      birthDate: '2012-04-23T18:25:43.511Z',
      addresses: [
        {
          name: 'TestAddressName',
          lat: 'TestLat',
          long: 'TestLong',
          _id: 'TestID',
        },
      ],
      rating: 5.0,
    }));
    const req = httpMocks.createRequest(
      {
        body: {
          id: 'TestID',
          name: 'TestName2',
          lastName: 'TestLastName',
          birthDate: '2012-04-23T18:25:43.511Z',
          addresses: [
            {
              name: 'TestAddressName',
              lat: 'TestLat',
              long: 'TestLong',
            },
          ],
          rating: 5.0,
        },
      },
    );

    const res = httpMocks.createResponse();
    await controller.update(req, res);

    // eslint-disable-next-line no-underscore-dangle
    const body = res._getData();
    expect(res.statusCode).toBe(200);
    expect(body.name).toBe('TestName');
    expect(body.lastName).toBe('TestLastName');
    expect(body.birthDate).toBe('2012-04-23T18:25:43.511Z');
    expect(body.addresses[0].name).toBe('TestAddressName');
    expect(body.addresses[0].lat).toBe('TestLat');
    expect(body.addresses[0].long).toBe('TestLong');
    expect(body.rating).toBe(5.0);
  });
});

// Delete
describe('When id is not found, deleteById', () => {
  it('should return a successful status, with a deletedCount of 0 ', async () => {
    service.deleteById.mockImplementation(() => ({
      acknowledged: true,
      deletedCount: 0,
    }));
    const req = httpMocks.createRequest({
      params: {
        id: 'TestID',
      },
    });

    const res = httpMocks.createResponse();
    await controller.deleteById(req, res);

    // eslint-disable-next-line no-underscore-dangle
    const body = res._getData();
    expect(res.statusCode).toBe(200);
    expect(body.acknowledged).toBe(true);
    expect(body.deletedCount).toBe(0);
  });
});

describe('When the user was found, deleteById', () => {
  it('should return a successful status, with a deletedCount of 1 ', async () => {
    service.deleteById.mockImplementation(() => ({
      acknowledged: true,
      deletedCount: 1,
    }));
    const req = httpMocks.createRequest({
      params: {
        id: 'TestID',
      },
    });

    const res = httpMocks.createResponse();
    await controller.deleteById(req, res);

    // eslint-disable-next-line no-underscore-dangle
    const body = res._getData();
    expect(res.statusCode).toBe(200);
    expect(body.acknowledged).toBe(true);
    expect(body.deletedCount).toBe(1);
  });
});
