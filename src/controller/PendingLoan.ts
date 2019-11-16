import { Request, Response } from 'express';
import { Loan } from '../Schema/schema';
import responseHelper from '../utils/responseHelper';

const { NODE_ENV } = process.env;

class PendingLoan {
  private Loan: any;
  constructor() {
    this.Loan = Loan;
  }
  getPendingRequest = async (req: Request, res: Response) => {
    try {
      const {
        userData: { email }
      } = req.body;
      const loan = await Loan.find({ email, status: 'pending' });
      if (loan.length) {
        return responseHelper(res, 200, 'Success', loan, true);
      }
      return responseHelper(res, 404, 'Fail', 'The loan does not exist', false);
    } catch (error) {
      return responseHelper(
        res,
        500,
        'Fail',
        `${
          NODE_ENV === 'test' || NODE_ENV === 'dev'
            ? error.message
            : 'Internal server error, please try again later'
        }`,
        false
      );
    }
  };
}

export default new PendingLoan();
