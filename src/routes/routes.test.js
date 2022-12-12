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
