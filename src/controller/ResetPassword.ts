import { Request, Response } from 'express';
// import * as bcrypt from 'bcryptjs';
import { User } from '../Schema/schema';
import responseHelper from '../utils/responseHelper';
import tokenHelper from '../utils/tokenHelper';
import notify from '../utils/notificationHelper';
const { SECRETE_KEY, NODE_ENV } = process.env;

class ResetPassword {
  private User: any;
  constructor() {
    this.User = User;
  }
  sendResetLink = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        return responseHelper(res, 400, 'Error', 'Email is required', false);
      }
      const userDetails: any = await User.findOne({ email });
      if (!userDetails) {
        return responseHelper(
          res,
          404,
          'Error',
          'This is not a valid email.',
          false
        );
      }
      const { email: userEmail, _id } = userDetails;
      const token: string = await tokenHelper.createToken(
        { email, id: _id },
        { expiresIn: '10h' },
        SECRETE_KEY
      );
      await User.findByIdAndUpdate(_id, { passwordResetToken: token });
      const link: string = `<a href=https://lender/password-reset/${token}>Follow this link to reset your password</a>`;
      await notify(userEmail, 'noreply@lender.com', 'password reset', link);
      return responseHelper(
        res,
        200,
        'Success',
        'A password reset link has been sent to your email',
        true
      );
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
export default new ResetPassword();
