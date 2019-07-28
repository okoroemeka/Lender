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
      .post('/api/v1/loans')
      .send(testData.loanData)
      .set('Accept', 'application/json')
      .set('authorization', token);
    loanId = res.body.data._id;
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('Success');
  });
  it('should return success for view loan applications by admin', async () => {
    await appRequest
      .post('/api/v1/loans')
      .send(testData.loanData)
      .set('Accept', 'application/json')
      .set('authorization', adminToken);
    const res = await appRequest
      .get('/api/v1/loans')
      .set('Accept', 'application/json')
      .set('authorization', adminToken);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Success');
    expect(res.body.data.length).toEqual(2);
  });
  it('should return success for view loan applications by non admin', async () => {
    const res = await appRequest
      .get('/api/v1/loans')
      .set('Accept', 'application/json')
      .set('authorization', token);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Success');
    expect(res.body.data.length).toEqual(1);
  });
  it('should return success for view specific loan applications by admin', async () => {
    const res = await appRequest
      .get(`/api/v1/loans/${loanId}`)
      .set('Accept', 'application/json')
      .set('authorization', adminToken);
    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe('object');
  });
  it('should return success for loan approval by admin', async () => {
    const res = await appRequest
      .patch(`/api/v1/loans/${loanId}`)
      .send(testData.approveLoanData)
      .set('Accept', 'application/json')
      .set('authorization', adminToken);
    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data.status).toEqual('approved');
  });
  it('should return success for loan rejection by admin', async () => {
    const res = await appRequest
      .patch(`/api/v1/loans/${loanId}`)
      .send(testData.rejectLoanData)
      .set('Accept', 'application/json')
      .set('authorization', adminToken);
    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe('object');
    expect(res.body.data.status).toEqual('rejected');
  });
  it('should return error for empty status field', async () => {
    const res = await appRequest
      .patch(`/api/v1/loans/${loanId}`)
      .send({})
      .set('Accept', 'application/json')
      .set('authorization', adminToken);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('Error');
    expect(res.body.message).toEqual('Status field is required');
  });
  it('should return error for non admin', async () => {
    const res = await appRequest
      .patch(`/api/v1/loans/${loanId}`)
      .send(testData.rejectLoanData)
      .set('Accept', 'application/json')
      .set('authorization', token);
    expect(res.status).toBe(401);
    expect(res.body.status).toBe('Error');
    expect(res.body.message).toEqual(
      'You are not authorised to perform this operation'
    );
  });
  it('should return error for wrong loan status reaction', async () => {
    const res = await appRequest
      .patch(`/api/v1/loans/${loanId}`)
      .send(testData.wrongStatusReaction)
      .set('Accept', 'application/json')
      .set('authorization', adminToken);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('Error');
    expect(res.body.message).toEqual(
      'status should be "approved" or "rejected"'
    );
  });
  it('Should return 200 for post a loan repayment by an admin', async () => {
    const res = await appRequest
      .post(`/api/v1/loans/${loanId}/repayment`)
      .send(testData.loanRepaymentdata)
      .set('Accept', 'application/json')
      .set('authorization', adminToken);
    expect(res.status).toBe(200);
    expect(res.body.status).toEqual('Success');
    expect(typeof res.body.data).toEqual('object');
  });
  it('Should return Error for loan repayment amount less than 0 or equal to 0', async () => {
    const res = await appRequest
      .post(`/api/v1/loans/${loanId}/repayment`)
      .send(testData.loanRepaymentAmountZero)
      .set('Accept', 'application/json')
      .set('authorization', adminToken);
    expect(res.status).toBe(400);
    expect(res.body.status).toEqual('Error');
    expect(res.body.message).toEqual('Amount must be greater than 0');
  });
  it('Should return Error for loan overpayment', async () => {
    const res = await appRequest
      .post(`/api/v1/loans/${loanId}/repayment`)
      .send(testData.loanRepaymentOverPay)
      .set('Accept', 'application/json')
      .set('authorization', adminToken);
    expect(res.status).toBe(400);
    expect(res.body.status).toEqual('Error');
    expect(res.body.message).toEqual(
      'Amount being paid is greater than what is owed'
    );
  });
  it('Should return Error for loan repayment post by non admin', async () => {
    const res = await appRequest
      .post(`/api/v1/loans/${loanId}/repayment`)
      .send(testData.loanRepaymentOverPay)
      .set('Accept', 'application/json')
      .set('authorization', token);
    expect(res.status).toBe(401);
    expect(res.body.status).toEqual('Error');
    expect(res.body.message).toEqual(
      'You are not authorised to perform this operation'
    );
  });
  it('Should return Error for loan that does not exist', async () => {
    const res = await appRequest
      .post(`/api/v1/loans/${'5d3ccc26023096d98d193022'}/repayment`)
      .send(testData.loanRepaymentOverPay)
      .set('Accept', 'application/json')
      .set('authorization', adminToken);
    expect(res.status).toBe(404);
    expect(res.body.status).toEqual('Error');
    expect(res.body.message).toEqual('loan not found');
  });
  it('Should return Error for wrong type of loan Id', async () => {
    const res = await appRequest
      .post(`/api/v1/loans/${1234}/repayment`)
      .send(testData.loanRepaymentOverPay)
      .set('Accept', 'application/json')
      .set('authorization', adminToken);
    expect(res.status).toBe(500);
    expect(res.body.status).toEqual('Error');
  });
  it('Should return error when no fully repaid loan', async () => {
    const res = await appRequest
      .get(`/api/v1/loans?status=approved&repaid=true`)
      .set('Accept', 'application/json')
      .set('authorization', adminToken);
    expect(res.status).toBe(404);
    expect(res.body.status).toEqual('Error');
    expect(res.body.message).toEqual('No loan found');
  });
  describe('get loans by admin', () => {
    let loanId: string = '';
    beforeAll(async () => {
      try {
        const response: any = await appRequest
          .post('/api/v1/loans')
          .send(testData.loanData)
          .set('Accept', 'application/json')
          .set('authorization', token);
        const {
          body: {
            data: { _id }
          }
        }: any = response;
        loanId = _id;
        await appRequest
          .patch(`/api/v1/loans/${loanId}`)
          .send(testData.approveLoanData)
          .set('Accept', 'application/json')
          .set('authorization', adminToken);
        await appRequest
          .post(`/api/v1/loans/${loanId}/repayment`)
          .send(testData.loanRepaymentTestData)
          .set('Accept', 'application/json')
          .set('authorization', adminToken);
      } catch (error) {
        throw new Error(error.message);
      }
    });
    it('Should return success for viewing all fully repaid loan by an admin', async () => {
      const res = await appRequest
        .get(`/api/v1/loans?status=approved&repaid=true`)
        .set('Accept', 'application/json')
        .set('authorization', adminToken);
      expect(res.status).toBe(200);
      expect(res.body.status).toEqual('Success');
      expect(typeof res.body.data).toEqual('object');
    });
    it('Should return error for viewing all fully repaid loan by non admin user', async () => {
      const res = await appRequest
        .get(`/api/v1/loans?status=approved&repaid=true`)
        .set('Accept', 'application/json')
        .set('authorization', token);
      expect(res.status).toBe(401);
      expect(res.body.status).toEqual('Error');
      expect(res.body.message).toEqual(
        'You are not authorised to perform this operation'
      );
    });
  });
});
