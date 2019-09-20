import * as request from 'supertest';
import app from '../src/app';
import { User } from '../src/Schema/schema';
import { testData } from './testData';
import Token from '../src/utils/tokenHelper';

const { SECRETE_KEY } = process.env;

let appRequest: request.SuperTest<request.Test>;
let token: string = '';
let wrongToken: string = '';
let nonExitingUserToken: string = '';

beforeAll(async () => {
  await User.deleteMany({}, error => console.log(error));
  appRequest = request(app);

  const res = await appRequest
    .post('/api/v1/auth/signup')
    .send(testData.signupUserSuccess)
    .set('Accept', 'application/json');
  token = res.body.data.token;
  wrongToken = await Token.createToken(
    { email: res.body.data.email },
    { expiresIn: '1h' },
    SECRETE_KEY
  );
  nonExitingUserToken = await Token.createToken(
    { email: res.body.data.email, userId: '5d39927e73fec93e55775d72' },
    { expiresIn: '1h' },
    SECRETE_KEY
  );
});
afterAll(async () => {
  await User.deleteMany({}, error => console.log(error));
});

describe('Profile test', () => {
  it('should return 200 for succesfully updating a usre profile', async () => {
    const res = await appRequest
      .patch(`/api/v1/edit-profile`)
      .send(testData.updateProfile)
      .set('Accept', 'application/json')
      .set('authorization', token);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Success');
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data.firstName).toEqual(testData.updateProfile.firstName);
  });
  it('should return 400 for user who does not exist', async () => {
    const res = await appRequest
      .patch(`/api/v1/edit-profile`)
      .send(testData.updateProfile)
      .set('Accept', 'application/json')
      .set('authorization', wrongToken);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('Error');
  });
  it('should return 404 for non existing user', async () => {
    const res = await appRequest
      .patch(`/api/v1/edit-profile`)
      .send(testData.updateProfile)
      .set('Accept', 'application/json')
      .set('authorization', nonExitingUserToken);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('Error');
  });
  it('should return 200 for view profile', async () => {
    const res = await appRequest
      .get(`/api/v1/edit-profile`)
      .set('Accept', 'application/json')
      .set('authorization', token);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Success');
  });
  it('should return 400 for user who does not exist', async () => {
    const res = await appRequest
      .get(`/api/v1/edit-profile`)
      .set('Accept', 'application/json')
      .set('authorization', wrongToken);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('Error');
  });
  it('should return 404 for non existing user', async () => {
    const res = await appRequest
      .get(`/api/v1/edit-profile`)
      .set('Accept', 'application/json')
      .set('authorization', nonExitingUserToken);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('Error');
  });
});
