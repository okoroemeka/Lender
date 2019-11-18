import { Request, Response } from 'express';
import { Loan, LoanRepayment } from '../Schema/schema';
import responseHelper from '../utils/responseHelper';
import request = require('request');

const { NODE_ENV } = process.env;

class Approved {
  private Loan: any;
  constructor() {
    this.Loan = Loan;
  }
  approvedButUnpaidLoan = async (req: Request, res: Response) => {
    try {
      const {
        userData: { email }
      } = req.body;
      const loan: Array<object> = await Loan.find({
        email,
        status: 'approved',
        repaid: false
      });
      if (loan.length) {
        return responseHelper(res, 200, 'Success', loan, true);
      }
      return responseHelper(res, 404, 'Error', 'Loan not found', false);
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

export default new Approved();
