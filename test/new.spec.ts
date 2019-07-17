import * as request from 'supertest';
import app from '../src/app';
import { User } from '../src/Schema/schema';

let appRequest: request.SuperTest<request.Test>;

describe('setup test', () => {
  beforeAll(() => {
    User.deleteMany({}, error => console.log(error));
    appRequest = request(app);
  });

  it('should return 200 for user signup', async () => {
    const res = await appRequest
      .post('/api/v1/auth/signup')
      .send({
        lastName: 'nnaemeka',
        firstName: 'okoro',
        email: 'mekarw056@gmail.com',
        password: 'wise2424',
        address: '1 aminu'
      })
      .set('Accept', 'application/json');
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.status).toEqual('Success');
  });
  it('should return 409 for an already existing user', async () => {
    const res = await appRequest
      .post('/api/v1/auth/signup')
      .send({
        lastName: 'nnaemeka',
        firstName: 'okoro',
        email: 'mekarw056@gmail.com',
        password: 'wise2424',
        address: '1 aminu'
      })
      .set('Accept', 'application/json');

    expect(res.status).toBe(409);
    expect(res.body.status).toEqual('Fail');
  });
});
console.log('NODE_ENV', process.env.NODE_ENV);
