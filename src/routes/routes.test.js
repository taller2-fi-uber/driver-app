jest.mock('../model/userModel');
const supertest = require('supertest');
const mongoose = require('mongoose');
const User = require('../model/driverModel');
const app = require('../app');

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
  const users = [];
  for (let i = 0; i < n; i += 1) {
    users.push(exampleUser);
  }
  return users;
};

// Ping endpoint test.
describe('A call to ping in the API', () => {
  it('should return a json message with the string Pong', async () => {
    const response = await request.get('/users/ping');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Pong');
  });
});

// Get an user by id
describe('A call to get an user by id', () => {
  it('should return a response with status 404 when the user was found', async () => {
    User.findById.mockImplementation(() => null);
    const response = await request.get(PATH + '/TestID');
    expect(response.status).toBe(404);
    expect(response.body.err).toBe('USER_NOT_FOUND_ERROR');
    expect(response.body.fields).toEqual(['TestID']);
    expect(response.body.msg).toBe('The user data was not found for the id');
  });

  it('should return a response with status 200 when the user was found', async () => {
    const testUserData = createExampleUserData(1)[0];
    User.findById.mockImplementation(() => testUserData);
    const response = await request.get(PATH + '/TestID');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(testUserData);
  });
});

// Get all users
describe('A call to get all users', () => {
  it('should return a 200 status and an empty array when no users are created', async () => {
    User.find.mockImplementation(() => []);
    const response = await request.get(PATH);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return a 200 status and an array of users when users are found', async () => {
    const testUserData = createExampleUserData(5);
    User.find.mockImplementation(() => testUserData);
    const response = await request.get(PATH);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(testUserData);
  });
});

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
    User.findByIdAndUpdate.mockImplementation(() => {
      throw new mongoose.Error.DocumentNotFoundError('TestID');
    });
    const response = await request
      .put(PATH)
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
      .put(PATH)
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
