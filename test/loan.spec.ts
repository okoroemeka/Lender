import * as request from 'supertest';
import app from '../src/app';
import { User, Loan } from '../src/Schema/schema';
import { testData } from './testData';

let appRequest: request.SuperTest<request.Test>;
let token: string = '';

beforeAll(async () => {
  await Loan.deleteMany({}, error => console.log(error));
  appRequest = request(app);
  const res = await appRequest
    .post('/api/v1/auth/signup')
    .send(testData.signupUserSuccess)
    .set('Accept', 'application/json');
  token = res.body.data.token;
});
afterAll(async () => {
  await Loan.deleteMany({}, error => console.log(error));
});
describe('Loan test', () => {
  it('should return success loan application', async () => {
    const res = await appRequest
      .post('/api/v1/loan')
      .send(testData.loanData)
      .set('Accept', 'application/json')
      .set('authorization', token);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('Success');
  });
});
