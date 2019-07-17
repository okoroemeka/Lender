import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from '../Schema/schema';

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
      const { SECRETE_KEY } = process.env;
      const checkUser = await User.findOne({
        email: new RegExp(`${email}`, 'gi')
      });
      if (checkUser) {
        return res.status(409).json({
          status: 'Fail',
          message: 'Email already exist'
        });
      }
      let hashPassword = await bcrypt.hash(password, 10);
      req.body.password = hashPassword;
      const { email: userEmail }: any = await User.create(req.body);
      const token = jwt.sign({ data: email }, SECRETE_KEY, { expiresIn: '1h' });
      return res.status(200).json({
        status: 'Success',
        email: userEmail,
        token
      });
    } catch (error) {
      return res.status(500).json({
        status: 'Error',
        mesasage: 'Internal serer error, please try again later'
      });
    }
  }
}

export default new UserAuth();
