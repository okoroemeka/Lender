import { Request, Response, NextFunction } from 'express';
import { User } from '../Schema/schema';
import responseHelper from '../utils/responseHelper';

const { NODE_ENV } = process.env;

interface profile {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
}
class Profile {
  public User: any;
  constructor() {
    this.User = User;
  }
  profileUpdate = async (req: Request, res: Response) => {
    try {
      const {
        editProfile,
        userData: { userId }
      }: any = req.body;
      if (!userId) {
        return responseHelper(
          res,
          400,
          'Error',
          'please login to complete your profile',
          false
        );
      }
      let user: any = await User.findById(userId);
      if (!user) {
        return responseHelper(
          res,
          404,
          'Error',
          'User does not exist, please signup to continue',
          true
        );
      }
      user = await User.findByIdAndUpdate(
        { _id: userId },
        {
          ...editProfile
        },
        { new: true }
      );
      return responseHelper(
        res,
        200,
        'Success',
        {
          _id: user.id,
          email: user.email,
          lastName: user.lastName,
          firstName: user.firstName,
          address: user.address
        },
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
export default new Profile();
