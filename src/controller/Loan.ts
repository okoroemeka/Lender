import { Request, Response } from 'express';
import { Loan } from '../Schema/schema';
import responseHelper from '../utils/responseHelper';
import notify from '../utils/notificationHelper';

const { NODE_ENV } = process.env;
class Loans {
  private Loan: any;
  constructor() {
    this.Loan = Loan;
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
      req.body.balance = amount + 0.05 * amount * tenor;
      req.body.email = email;
      req.body.interest = 0.05 * amount;
      req.body.paymentInstallment = amount / tenor + req.body.interest;
      req.body.createdOn = new Date();
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
        userData: { isAdmin },
        amount
      }: any = req.body;
      if (!isAdmin) {
        return responseHelper(
          res,
          401,
          'Error',
          'You are not authorised to perform this operation',
          false
        );
      }
      const loan: any = await Loan.findById(id);
      if (!loan) {
        return responseHelper(res, 404, 'Error', 'loan not found', false);
      }
      const { balance, repaid } = loan;
      if (repaid) {
        return responseHelper(
          res,
          400,
          'Error',
          'Loan has been already repaid',
          false
        );
      }
      if (amount > balance) {
        return responseHelper(
          res,
          400,
          'Error',
          'Amount being paid is greater than what is owed',
          false
        );
      }
      if (amount <= 0) {
        return responseHelper(
          res,
          400,
          'Error',
          'Amount must be greater than 0',
          false
        );
      }
      const loanUpdated: any = await Loan.findByIdAndUpdate(
        id,
        {
          balance: balance - amount,
          repaid: balance === amount ? true : false
        },
        { new: true }
      );
      return responseHelper(res, 200, 'Success', loanUpdated, true);
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
