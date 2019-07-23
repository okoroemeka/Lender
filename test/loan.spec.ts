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
  await Loan.deleteMany({}, error => console.log(error));
});
describe('Loan test', () => {
  it('should return success loan application', async () => {
    const res = await appRequest
      .post('/api/v1/loan')
      .send(testData.loanData)
      .set('Accept', 'application/json')
      .set('authorization', token);
    loanId = res.body.data._id;
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('Success');
  });
  it('should return success for view loan applications by admin', async () => {
    await appRequest
      .post('/api/v1/loan')
      .send(testData.loanData)
      .set('Accept', 'application/json')
      .set('authorization', adminToken);
    const res = await appRequest
      .get('/api/v1/loan')
      .set('Accept', 'application/json')
      .set('authorization', adminToken);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Success');
    expect(res.body.data.length).toEqual(2);
  });
  it('should return success for view loan applications by non admin', async () => {
    const res = await appRequest
      .get('/api/v1/loan')
      .set('Accept', 'application/json')
      .set('authorization', token);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Success');
    expect(res.body.data.length).toEqual(1);
  });
  it('should return success for view specific loan applications by admin', async () => {
    const res = await appRequest
      .get(`/api/v1/loan/${loanId}`)
      .set('Accept', 'application/json')
      .set('authorization', adminToken);
    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe('object');
  });
});
