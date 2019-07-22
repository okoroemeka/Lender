import { Request, Response, NextFunction } from 'express';
import { Loan } from '../Schema/schema';
import responseHelper from '../utils/responseHelper';

class Loans {
  private Loan: any;
  constructor() {
    this.Loan = Loan;
  }
  createLoan = async (req: Request, res: Response) => {
    try {
      const { tenor, amount } = req.body;
      req.body.balance = amount;
      req.body.interest = 0.05 * amount;
      req.body.paymentInstallment = amount / tenor + req.body.interest;
      req.body.createdOn = new Date();
      const createLoan = await Loan.create(req.body);
      return responseHelper(res, 201, 'Success', createLoan, true);
    } catch (error) {
      return responseHelper(res, 500, 'Error', error.message, false);
    }
  };
}

export default new Loans();
