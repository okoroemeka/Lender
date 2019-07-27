import * as request from 'supertest';
import app from '../src/app';
import { User } from '../src/Schema/schema';
import { testData } from './testData';
const { TEST_EMAIL } = process.env;
let appRequest: request.SuperTest<request.Test>;
let adminToken: string = '';
let token: string = '';
beforeAll(async () => {
  await User.deleteMany({}, error => console.log(error));
  const adminData = await testData.signupAdminUserSuccess();
  await User.create(adminData);
  appRequest = request(app);

  const adminSigninResponse = await appRequest
    .post('/api/v1/auth/signin')
    .send(testData.signinAdminUserSuccess)
    .set('Accept', 'application/json');
  adminToken = adminSigninResponse.body.data.token;
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
      token = res.body.data.token;
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
    it('should verify a user', async () => {
      const res = await appRequest
        .patch(`/api/v1/users/${TEST_EMAIL}/verify`)
        .send(testData.verifyUserData)
        .set('Accept', 'application/json')
        .set('authorization', adminToken);
      expect(res.status).toBe(200);
      expect(res.body.status).toEqual('Success');
      expect(typeof res.body.data).toEqual('object');
      expect(res.body.data.status).toEqual('verified');
    });
    it('should return error for non admin trying to verify a user', async () => {
      const res = await appRequest
        .patch(`/api/v1/users/${TEST_EMAIL}/verify`)
        .send(testData.verifyUserData)
        .set('Accept', 'application/json')
        .set('authorization', token);
      expect(res.status).toBe(403);
      expect(res.body.status).toEqual('Error');
      expect(res.body.message).toEqual(
        'You are not alllowed to perform this operation'
      );
    });
    it('should return error for trying to verify a user with empty status', async () => {
      const res = await appRequest
        .patch(`/api/v1/users/${TEST_EMAIL}/verify`)
        .send(testData.verifyUserWithEmptyStatusData)
        .set('Accept', 'application/json')
        .set('authorization', adminToken);
      expect(res.status).toBe(400);
      expect(res.body.status).toEqual('Error');
      expect(res.body.message).toEqual('The verify user field cannot be empty');
    });
    it('should return error for trying to verify a user with wrong status', async () => {
      const res = await appRequest
        .patch(`/api/v1/users/${TEST_EMAIL}/verify`)
        .send(testData.verifyUserWithWrongStatusData)
        .set('Accept', 'application/json')
        .set('authorization', adminToken);
      expect(res.status).toBe(400);
      expect(res.body.status).toEqual('Error');
      expect(res.body.message).toEqual(
        'verification status must be "verified" or "unverified"'
      );
    });
  });
});
