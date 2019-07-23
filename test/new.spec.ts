import * as request from 'supertest';
import app from '../src/app';
import { User } from '../src/Schema/schema';
import { testData } from './testData';

let appRequest: request.SuperTest<request.Test>;

beforeAll(async () => {
  await User.deleteMany({}, error => console.log(error));
  appRequest = request(app);
});
afterAll(async () => {
  await User.deleteMany({}, error => console.log(error));
});
describe('Authentication test', () => {
  describe('User signup', () => {
    it('should return 201 for user signup', async () => {
      const res = await appRequest
        .post('/api/v1/auth/signup')
        .send(testData.signupUserSuccess)
        .set('Accept', 'application/json');
      expect(res.status).toBe(201);
      expect(res.body.status).toEqual('Success');
    });
    it('should return 409 for an already existing user', async () => {
      const res = await appRequest
        .post('/api/v1/auth/signup')
        .send(testData.signupExistingUser)
        .set('Accept', 'application/json');
      expect(res.status).toBe(409);
      expect(res.body.status).toEqual('Fail');
    });
  });
  describe('user signin', () => {
    it('should successfully signin user', async () => {
      const res = await appRequest
        .post('/api/v1/auth/signin')
        .send(testData.signinUserSuccess)
        .set('Accept', 'application/json');
      expect(res.status).toBe(200);
      expect(res.body.status).toEqual('Success');
      expect(typeof res.body.data.token).toBe('string');
    });
    it('should return error for non existing', async () => {
      const res = await appRequest
        .post('/api/v1/auth/signin')
        .send(testData.signinNonUser);
      expect(res.status).toBe(404);
      expect(res.body.status).toEqual('Fail');
    });
    it('should return error for wrong password', async () => {
      const res = await appRequest
        .post('/api/v1/auth/signin')
        .send(testData.signinUserWrongPassword)
        .set('Accept', 'application/json');
      expect(res.status).toBe(400);
      expect(res.body.status).toEqual('Fail');
      expect(res.body.message).toEqual('Wrong email or password');
    });
  });
});
