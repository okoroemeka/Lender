import * as request from 'supertest';
import app from '../src/app';
import { User } from '../src/Schema/schema';
import { testData } from './testData';

let appRequest: request.SuperTest<request.Test>;
let token: string = '';
let adminToken: string = '';
const { WRONG_JWT } = process.env;
beforeAll(async () => {
  try {
    /* Clear table before test and signup Admin */
    await User.deleteMany({}, error => console.log(error));
    const adminData = await testData.signupAdminUserSuccess();
    await User.create(adminData);
    appRequest = request(app);

    /* Get Admin token */
    const adminSigninResponse = await appRequest
      .post('/api/v1/auth/signin')
      .send(testData.signinAdminUserSuccess)
      .set('Accept', 'application/json');
    adminToken = adminSigninResponse.body.data.token;

    /* Get non adminuser token */
    const res = await appRequest
      .post('/api/v1/auth/signup')
      .send(testData.signupUserSuccess)
      .set('Accept', 'application/json');
    token = res.body.data.token;
  } catch (error) {
    throw new Error(error.message);
  }
});
/* Clear table after test */
afterAll(async () => {
  await User.deleteMany({}, error => console.log(error));
});
describe('Send Reset password Link test', () => {
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
describe('Update password test', () => {
  let passwordResetToken: string = '';
  beforeAll(async () => {
    try {
      const { email } = testData.resetPassword;
      const { passwordResetToken: token }: any = await User.findOne({ email });
      passwordResetToken = token;
    } catch (error) {
      throw new Error(error.message);
    }
  });
  it('should return success for password update', async () => {
    const res = await appRequest
      .patch(`/api/v1/reset-password/${passwordResetToken}`)
      .send(testData.resetPasswordData)
      .set('Accept', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Success');
  });
  it('should return error for mismatched password', async () => {
    const res = await appRequest
      .patch(`/api/v1/reset-password/${passwordResetToken}`)
      .send(testData.resetPasswordMismatchData)
      .set('Accept', 'application/json');
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('Error');
  });
  it('should return error for wrong token', async () => {
    const res = await appRequest
      .patch(`/api/v1/reset-password/${WRONG_JWT}`)
      .send(testData.resetPasswordData)
      .set('Accept', 'application/json');
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('Error');
  });
});
