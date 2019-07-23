import { Request, Response, NextFunction } from 'express';
import { Loan } from '../Schema/schema';
import responseHelper from '../utils/responseHelper';

class Loans {
  private Loan: any;
  constructor() {
    this.Loan = Loan;
  }
  /**
   * Loan application.
   * @param req
   * @param res
   * @returns object
   */
  createLoan = async (req: Request, res: Response) => {
    try {
      const {
        tenor,
        amount,
        userData: { email }
      } = req.body;
      req.body.balance = amount;
      req.body.email = email;
      req.body.interest = 0.05 * amount;
      req.body.paymentInstallment = amount / tenor + req.body.interest;
      req.body.createdOn = new Date();
      const createLoan = await Loan.create(req.body);
      return responseHelper(res, 201, 'Success', createLoan, true);
    } catch (error) {
      return responseHelper(res, 500, 'Error', error.message, false);
    }
  };
  /**
   * Get all loan application
   * @param req
   * @param res
   * @returns object
   */
  viewAllLoanApplication = async (req: Request, res: Response) => {
    try {
      const { email, isAdmin } = req.body.userData;
      const loanApplications: Array<object> = await Loan.find(
        isAdmin ? {} : { email: new RegExp(`${email}`, 'gi') }
      );
      const responsePackage: any = {
        statusCode: loanApplications.length ? 200 : 404,
        status: loanApplications.length ? 'Success' : 'Fail',
        message: loanApplications.length
          ? loanApplications
          : `${
              isAdmin
                ? 'No loan application was found'
                : 'You have no loan application yet'
            }`,
        responseType: loanApplications.length ? true : false
      };
      return responseHelper(
        res,
        responsePackage.statusCode,
        responsePackage.status,
        responsePackage.message,
        responsePackage.responseType
      );
    } catch (error) {
      return responseHelper(res, 500, 'Error', error.message, false);
    }
  };
}

export default new Loans();
