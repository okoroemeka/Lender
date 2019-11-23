import { Request, Response } from 'express';
import { Loan, LoanRepayment } from '../Schema/schema';
import responseHelper from '../utils/responseHelper';
import notify from '../utils/notificationHelper';

const { NODE_ENV } = process.env;

interface LoanInterface {
  status: string;
  repaid: false;
  _id: string;
  amount: number;
  tenor: number;
  balance: number;
  email: string;
  interest: number;
  paymentInstallment: number;
  createdOn: string;
  __v: number;
}

class Loans {
  private Loan: any;
  private LoanRepayment: any;
  constructor() {
    this.Loan = Loan;
    this.LoanRepayment = LoanRepayment;
  }
  /**
   * Loan application.
   * @param {object}req
   * @param {object}res
   * @returns {object}loan
   */
  createLoan = async (req: Request, res: Response) => {
    try {
      const {
        tenor,
        amount,
        userData: { email }
      } = req.body;
      const newAmount: number = Number(amount);
      const newTenor: number = Number(tenor);
      const loanDueDate = new Date();
      req.body.balance = 0.05 * newAmount * newTenor + newAmount;
      req.body.email = email;
      req.body.interest = 0.05 * newAmount;
      req.body.monthlyInstallment = Number.parseFloat(
        newAmount / newTenor + req.body.interest
      ).toFixed(2);
      req.body.createdOn = Date.now();
      req.body.dueDate = loanDueDate.setMonth(
        loanDueDate.getMonth() + newTenor
      );
      const check = await Loan.findOne().or([
        { status: 'pending', email },
        { email, repaid: false, status: 'approved' }
      ]);
      if (check) {
        return responseHelper(
          res,
          400,
          'Error',
          'You have a pending loan request or an unpaid loan',
          false
        );
      }
      const createLoan: any = await Loan.create(req.body);
      return responseHelper(res, 201, 'Success', createLoan, true);
    } catch (error) {
      return responseHelper(res, 500, 'Error', error.message, false);
    }
  };
  /**
   * Get all loan application
   * @param {object}req
   * @param {object}res
   * @returns {array} loans
   */
  viewAllLoanApplication = async (req: Request, res: Response) => {
    try {
      const { status, repaid } = req.query;
      const {
        userData: { email, isAdmin }
      } = req.body;

      if (
        (status === 'approved' && repaid === 'true') ||
        (status === 'approved' && repaid === 'false')
      ) {
        const response: Array<object> | string = isAdmin
          ? await Loan.find({ status, repaid })
          : 'You are not authorised to perform this operation';
        const responseObject: object = {
          statusCode: isAdmin ? (response.length ? 200 : 404) : 401,
          status: isAdmin ? (response.length ? 'Success' : 'Error') : 'Error',
          dataOrMessage: isAdmin
            ? response.length
              ? response
              : 'No loan found'
            : response,
          responsHelperStatus: isAdmin
            ? response.length
              ? true
              : false
            : false
        };
        const {
          statusCode,
          status: helperStatus,
          dataOrMessage,
          responsHelperStatus
        }: any = responseObject;
        return responseHelper(
          res,
          statusCode,
          helperStatus,
          dataOrMessage,
          responsHelperStatus
        );
      }
      const loanApplications: Array<object> = await Loan.find(
        isAdmin ? {} : { email: new RegExp(`${email}`, 'i') }
      );
      const responsePackage: any = {
        statusCode: loanApplications.length ? 200 : 404,
        status: loanApplications.length ? 'Success' : 'Error',
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
  /**
   * Get specific loan application
   * @param {object}req
   * @param {object}res
   * @returns {object} loan
   */
  getSpecificLoan = async (req: Request, res: Response) => {
    try {
      const {
        userData: { isAdmin }
      }: any = req.body;
      const { id }: any = req.params;
      if (!isAdmin) {
        return responseHelper(
          res,
          401,
          'Error',
          'You are not allowed to view this loan application.',
          false
        );
      }
      const loan: object = await Loan.findById(id);
      if (!loan) {
        return responseHelper(res, 404, 'Error', 'loan not found', false);
      }
      return responseHelper(res, 200, 'Success', loan, true);
    } catch (error) {
      return responseHelper(
        res,
        500,
        'Error',
        'Internal server error, Please try again later',
        false
      );
    }
  };
  /**
   * React to a specific loan application
   * @param {object}req
   * @param {object}res
   * @returns {array} loan
   */
  reactToLoanApplication = async (req: Request, res: Response) => {
    try {
      const {
        userData: { isAdmin },
        status
      }: any = req.body;
      const { id }: any = req.params;
      if (!status || !status.trim().length) {
        return responseHelper(
          res,
          400,
          'Error',
          'Status field is required',
          false
        );
      }
      if (!isAdmin) {
        return responseHelper(
          res,
          401,
          'Error',
          'You are not authorised to perform this operation',
          false
        );
      }
      const statusFromAdmin: string = status.toLowerCase();
      if (statusFromAdmin !== 'approved' && statusFromAdmin !== 'rejected') {
        return responseHelper(
          res,
          400,
          'Error',
          'status should be "approved" or "rejected"',
          false
        );
      }
      const loan: any = await Loan.findByIdAndUpdate(
        id,
        { status: statusFromAdmin },
        { new: true }
      );
      await notify(
        loan.email,
        'noReply@lender.com',
        'loan application',
        `<Strong>
        ${
          statusFromAdmin === 'rejected'
            ? 'We are sorry to inform you that'
            : ''
        } ${
          statusFromAdmin === 'rejected' ? 'y' : 'Y'
        }our loan application was ${statusFromAdmin}.
        </strong>`
      );
      return responseHelper(res, 200, 'Success', loan, true);
    } catch (error) {
      return responseHelper(res, 500, 'Error', error.message, false);
    }
  };
  /**
   * Loan repayment by an admin
   * @param {object}req
   * @param {object}res
   * @returns {object} loan
   */
  loanRepayment = async (req: Request, res: Response) => {
    try {
      const { loanId: id }: any = req.params;
      const {
        // userData: { isAdmin },
        amount: paidAmount
      }: any = req.body;
      // if (!isAdmin) {
      //   return responseHelper(
      //     res,
      //     401,
      //     'Error',
      //     'You are not authorised to perform this operation',
      //     false
      //   );
      // }
      const loan: any = await Loan.findById(id);
      if (!loan) {
        return responseHelper(res, 404, 'Error', 'loan not found', false);
      }
      const { balance, repaid, monthlyInstallment, amount } = loan;
      if (repaid) {
        return responseHelper(
          res,
          400,
          'Error',
          'Loan has been already repaid',
          false
        );
      }
      if (paidAmount > balance) {
        return responseHelper(
          res,
          400,
          'Error',
          'Amount being paid is greater than what is owed',
          false
        );
      }
      if (paidAmount <= 0) {
        return responseHelper(
          res,
          400,
          'Error',
          'Amount must be greater than 0',
          false
        );
      }
      const { balance: newbalance }: any = await Loan.findByIdAndUpdate(
        id,
        {
          balance: balance - paidAmount,
          repaid: balance === paidAmount ? true : false
        },
        { new: true }
      );
      const payLoad: object = {
        loanId: id,
        paidAmount,
        monthlyInstallment,
        createdOn: new Date()
      };
      const { createdOn }: any = await LoanRepayment.create(payLoad);
      const responseOject: object = {
        createdOn,
        loanId: id,
        amount,
        monthlyInstallment,
        paidAmount,
        newbalance
      };
      return responseHelper(res, 200, 'Success', responseOject, true);
    } catch (error) {
      return responseHelper(
        res,
        500,
        'Error',
        `${
          NODE_ENV === 'test' || NODE_ENV === 'dev'
            ? error.message
            : 'Internal server error, please try again later'
        }`,
        false
      );
    }
  };
  /**
   * Get loan repayment history
   * @param {object}req
   * @param {object}res
   * @returns {object} loans
   */
  loanRepaymentHistory = async (req: Request, res: Response) => {
    const { loanId } = req.params;
    try {
      const loans: any = await LoanRepayment.find({
        loanId
      });
      if (!loans.length) {
        return responseHelper(
          res,
          404,
          'Error',
          'No loan history found',
          false
        );
      }
      return responseHelper(res, 200, 'Success', loans, true);
    } catch (error) {
      return responseHelper(
        res,
        500,
        'Error',
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
export default new Loans();
