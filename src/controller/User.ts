import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import { User } from '../Schema/schema';
import responseHelper from '../utils/responseHelper';
import Token from '../utils/tokenHelper';

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
   * @param req
   * @param res
   * @returns object
   */
  async userSignup(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const checkUser = await User.findOne({
        email: new RegExp(`${email}`, 'gi')
      });
      if (checkUser) {
        return responseHelper(res, 409, 'Fail', 'Email already exist', false);
      }
      let hashPassword = await bcrypt.hash(password, 10);
      req.body.password = hashPassword;
      const { email: userEmail }: any = await User.create(req.body);
      const token = await Token.createToken(
        { email },
        { expiresIn: '1h' },
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
      const { email: userEmail, password: userPassowrd } = response;
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
          token: Token.createToken({ email }, { expiresIn: '1h' }, SECRETE_KEY)
        },
        true
      );
    } catch (error) {
      return responseHelper(res, 500, 'Error', error.message, false);
    }
  };
}

export default new UserAuth();
