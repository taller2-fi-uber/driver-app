jest.mock('../model/driverModel');
const supertest = require('supertest');
const Driver = require('../model/driverModel');
const app = require('../app');

const request = supertest(app);

const createExampleDriverData = (n) => {
  const exampleDriver = {
    _id: 'TestID',
    vehicle: {
      brand: 'Ford',
      model: 'Ranger Raptor',
      year: 2022,
      plate: 'FAK391ATE'
    },
    rating: {
      rate: 5.0,
      count: 1,
    },
    vip: true,
  };
  
  const drivers = [];
  for (let i = 0; i < n; i += 1) {
    drivers.push(exampleDriver);
  }
  return drivers;
};

// Ping endpoint test.
describe('A call to ping in the API', () => {
  it('should return a json message with the string Pong', async () => {
    const response = await request.get('/driver/ping');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Pong');
  });
});

describe('A call to get an user by id', () => {
  it('should return a response with status 404 when the user was not found', async () => {
    Driver.findById.mockImplementation(() => null);
    const response = await request.get('/driver/drivers/TestID');
    expect(response.status).toBe(404);
    expect(response.body.err).toBe('USER_NOT_FOUND_ERROR');
  });

  it('should return a response with status 200 when the user was found', async () => {
    const testDriverData = createExampleDriverData(1)[0];
    Driver.findById.mockImplementation(() => testDriverData);
    const response = await request.get('/driver/drivers/TestID');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(testDriverData);
  });
});

describe('A call to get all drivers', () => {
  it('should return a 200 status and an empty array when no drivers are created', async () => {
    Driver.find.mockImplementation(() => []);
    const response = await request.get('/driver/drivers/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return a 200 status and an array of users when drivers are found', async () => {
    const testDriverData = createExampleDriverData(5);
    Driver.find.mockImplementation(() => testDriverData);
    const response = await request.get('/driver/drivers/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(testDriverData);
  });
});

describe('A call to rate the driver', () => {
  it('should return the new rating data', async () => {
    const testDriverData = createExampleDriverData(1)[0];
    Driver.findById.mockImplementation(() => testDriverData);
    const updatedTestDriverData = createExampleDriverData(1)[0];
    updatedTestDriverData.rating = {
      rate: 4.0,
      count: 2,
    }
    Driver.findByIdAndUpdate.mockImplementation(() => updatedTestDriverData);
    const response = await request
    .patch('/driver/qualification/TestID')
    .set({
      'type': 'driver',
    })
    .send({
      qualification: 3.0,
    });
    expect(response.status).toBe(200);
    expect(response.body.rating).toEqual({
      rate: 4.0,
      count: 2,
    });
  });

  it('Should return an error when user is not a driver', async () => {
    const response = await request
    .patch('/driver/qualification/TestID')
    .set({
      'type': 'not-a-driver',
    })
    .send({
      qualification: 3.0,
    });
    expect(response.status).toBe(400);
    expect(response.body.err).toBe('INVALID_OPERATION');
  });

  it('Should return an error when rating is not a number between 5 and 0', async () => {
    const response = await request
    .patch('/driver/qualification/TestID')
    .set({
      'type': 'driver',
    })
    .send({
      qualification: -6.0,
    });
    expect(response.status).toBe(400);
    expect(response.body.err).toBe('OUT_OF_RANGE');
  });
});

describe('A call to make the driver VIP', () => {
  it('should return and error if driver was mvp already', async () => {
    const testDriverData = createExampleDriverData(1)[0];
    testDriverData.vip = true;
    Driver.findById.mockImplementation(() => testDriverData);
    const response = await request
    .patch('/driver/vip')
    .set({
      'type': 'driver',
      'user': 'TestID',
    })
    .send({
      qualification: 3.0,
    });
    expect(response.status).toBe(400);
    expect(response.body.err).toBe('INVALID_OPERATION');
  });

  it('should return 200 status if driver was not mvp already', async () => {
    const testDriverData = createExampleDriverData(1)[0];
    testDriverData.vip = false;
    Driver.findById.mockImplementation(() => testDriverData);
    const response = await request
    .patch('/driver/vip')
    .set({
      'type': 'driver',
      'user': 'TestID',
    })
    .send({
      qualification: 3.0,
    });
    expect(response.status).toBe(200);
    expect(response.body.vip).toBe(true);
  });
});
/*
jest.mock('../model/userModel');
jest.mock('../service/walletService');
const supertest = require('supertest');
const mongoose = require('mongoose');
const User = require('../model/userModel');
const app = require('../app');
const walletService = require('../service/walletService');

const PATH = '/users/users';

const request = supertest(app);
const createExampleUserData = (n) => {
  const exampleUser = {
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
  };
  walletService.createWallet.mockImplementation(() => {return 1;});
  const users = [];
  for (let i = 0; i < n; i += 1) {
    users.push(exampleUser);
  }
  return users;
};

// Create an user
describe('A call to create an user', () => {
  it('should return a 201 status and the data created when data was valid', async () => {
    const testUserData = createExampleUserData(1)[0];
    const requestData = {
      name: 'TestName',
      lastName: 'TestLastName',
      birthDate: '2012-04-23T18:25:43.511Z',
    };
    User.create.mockImplementation(() => testUserData);
    walletService.createWallet.mockImplementation(() => {return 1;});
    const response = await request
      .post(PATH)
      .send(requestData)
      .expect(201);
    expect(response.body).toEqual(testUserData);
  });

  // TODO: preguntar como mockear User de forma que el constructor funcione con las validaciones
  it.skip('should return a 401 when data is not valid', async () => {
    const requestData = {
      name: 'TestName',
      lastName: 'TestLastName',
      birthDate: 'Invalid birthDate',
    };
    const response = await request
      .post(PATH)
      .send(requestData);
    expect(response.status).toBe(401);
  });
});

// Update an user
describe('A call to update an user', () => {
  it('should return a 404 status with an error when no user was found', async () => {
    const requestData = createExampleUserData(1)[0];
    walletService.createWallet.mockImplementation(() => {return 1;});
    User.findByIdAndUpdate.mockImplementation(() => {
      throw new mongoose.Error.DocumentNotFoundError('TestID');
    });
    const response = await request
      .patch(PATH)
      .send(requestData);
    expect(response.status).toBe(404);
    expect(response.body.err).toBe('USER_NOT_FOUND_ERROR');
    expect(response.body.fields).toEqual(['TestID']);
    expect(response.body.msg).toBe('The user data was not found for the id');
  });

  it('should return a 200 status with the old document', async () => {
    const requestData = createExampleUserData(1)[0];
    const oldUserData = createExampleUserData(1)[0];
    requestData.name = 'NewName';
    User.findByIdAndUpdate.mockImplementation(() => oldUserData);
    const response = await request
      .patch(PATH)
      .send(requestData);
    expect(response.status).toBe(200);
    expect(requestData.name).toBe('NewName');
    expect(response.body.name).toEqual('TestName');
  });
});

// Delete an user
describe('A call to delete an user', () => {
  it('should return 200 status response, with a deleted count of 0 when no user was found', async () => {
    User.deleteOne.mockImplementation(() => ({
      acknowledged: true,
      deletedCount: 0,
    }));
    const response = await request.delete(PATH + '/TestID');
    expect(response.status).toBe(200);
    expect(response.body.acknowledged).toBe(true);
    expect(response.body.deletedCount).toBe(0);
  });

  it('should return 200 status response, with a deleted count of 1 when a user was found', async () => {
    User.deleteOne.mockImplementation(() => ({
      acknowledged: true,
      deletedCount: 1,
    }));
    const response = await request.delete(PATH + '/TestID');
    expect(response.status).toBe(200);
    expect(response.body.acknowledged).toBe(true);
    expect(response.body.deletedCount).toBe(1);
  });
});

*/