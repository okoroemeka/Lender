import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import { User } from '../Schema/schema';
import responseHelper from '../utils/responseHelper';
import Token from '../utils/tokenHelper';
import notify from '../utils/notificationHelper';

const { SECRETE_KEY } = process.env;

/**
 * User authentication
 */
class UserAuth {
  private User: any;
  constructor() {
    this.User = User;
  }
  /**
   * Creates New User
   * @param {object}req
   * @param {object}res
   * @returns {object}user
   */
  async userSignup(req: Request, res: Response) {
    try {
      const { email, password, lastName, firstName, address } = req.body;
      const checkUser = await User.findOne({
        email: new RegExp(`${email}`, 'gi')
      });
      if (checkUser) {
        return responseHelper(res, 409, 'Fail', 'Email already exist', false);
      }
      let hashPassword = await bcrypt.hash(password, 10);
      const { email: userEmail, isAdmin }: any = await User.create({
        email,
        password: hashPassword,
        lastName,
        firstName,
        address
      });
      const token = await Token.createToken(
        { email, isAdmin },
        { expiresIn: '10h' },
        SECRETE_KEY
      );
      return responseHelper(
        res,
        201,
        'Success',
        { email: userEmail, token },
        true
      );
    } catch (error) {
      return responseHelper(
        res,
        500,
        'Error',
        'Internal serer error, please try again later',
        false
      );
    }
  }
  /**
   * Signin  User
   * @param {object}req
   * @param {object}res
   * @returns {object}user
   */
  signin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const response: any = await User.findOne({
        email: new RegExp(`${email}`, 'gi')
      });
      if (!response) {
        return responseHelper(
          res,
          404,
          'Fail',
          'Email does not exist, please signup',
          false
        );
      }
      const { email: userEmail, password: userPassowrd, isAdmin } = response;
      if (!(await bcrypt.compare(password, userPassowrd))) {
        return responseHelper(
          res,
          400,
          'Fail',
          'Wrong email or password',
          false
        );
      }
      return responseHelper(
        res,
        200,
        'Success',
        {
          email: userEmail,
          token: Token.createToken(
            { email, isAdmin },
            { expiresIn: '10h' },
            SECRETE_KEY
          )
        },
        true
      );
    } catch (error) {
      return responseHelper(res, 500, 'Error', error.message, false);
    }
  };
  /**
   * Verify a User loan application
   * @param {object}req
   * @param {object}res
   * @returns {object}user
   */
  verifyUser = async (req: Request, res: Response) => {
    try {
      const { user_email: email } = req.params;
      const {
        userData: { isAdmin },
        verificationStatus
      } = req.body;
      if (!isAdmin)
        return responseHelper(
          res,
          403,
          'Error',
          'You are not alllowed to perform this operation',
          false
        );
      if (!verificationStatus || !verificationStatus.trim().length)
        return responseHelper(
          res,
          400,
          'Error',
          'The verify user field cannot be empty',
          false
        );
      const statusValue = verificationStatus.toLowerCase();
      if (statusValue !== 'verified' && statusValue !== 'unverified') {
        return responseHelper(
          res,
          400,
          'Error',
          'verification status must be "verified" or "unverified"',
          false
        );
      }
      const user = await User.findOneAndUpdate(
        { email },
        { status: statusValue },
        { new: true }
      );
      await notify(
        email,
        'noReply@lender.com',
        'user verification',
        `<Strong>
      ${
        statusValue === 'unverified'
          ? "Sorry, you can't apply for loan."
          : 'You have been verified to apply for a loan'
      } 
      </strong>`
      );
      return responseHelper(res, 200, 'Success', user, true);
    } catch (error) {
      return responseHelper(res, 500, 'Error', error.message, false);
    }
  };
}

export default new UserAuth();
