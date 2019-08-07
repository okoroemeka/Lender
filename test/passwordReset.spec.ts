import * as request from 'supertest';
import app from '../src/app';
import { User, Loan } from '../src/Schema/schema';
import { testData } from './testData';

let appRequest: request.SuperTest<request.Test>;
let token: string = '';
let adminToken: string = '';
let loanId: string = '';
beforeAll(async () => {
  await User.deleteMany({}, error => console.log(error));
  await Loan.deleteMany({}, error => console.log(error));
  const adminData = await testData.signupAdminUserSuccess();
  await User.create(adminData);
  appRequest = request(app);

  const adminSigninResponse = await appRequest
    .post('/api/v1/auth/signin')
    .send(testData.signinAdminUserSuccess)
    .set('Accept', 'application/json');
  adminToken = adminSigninResponse.body.data.token;

  const res = await appRequest
    .post('/api/v1/auth/signup')
    .send(testData.signupUserSuccess)
    .set('Accept', 'application/json');
  token = res.body.data.token;
});
afterAll(async () => {
  await User.deleteMany({}, error => console.log(error));
});
describe('Reset password test', () => {
  it('should return success password reset application', async () => {
    const res = await appRequest
      .post('/api/v1/reset-password')
      .send(testData.resetPassword)
      .set('Accept', 'application/json')
      .set('authorization', token);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Success');
  });
  it('should return error for a non existing user', async () => {
    const res = await appRequest
      .post('/api/v1/reset-password')
      .send(testData.resetPasswordWrongEmail)
      .set('Accept', 'application/json')
      .set('authorization', token);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('Error');
  });
});
