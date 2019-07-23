import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import responseHelper from '../utils/responseHelper';
const { SECRETE_KEY } = process.env;

class TokenHelper {
  constructor() {}
  createToken = (
    data: object,
    expiresIn: object,
    secreteKey: string
  ): string => {
    return jwt.sign(data, secreteKey, expiresIn);
  };
  verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization || req.body.token;
      if (!token) {
        return responseHelper(res, 403, 'Fail', 'No token was provided', false);
      }
      const userData: any = await jwt.verify(token, SECRETE_KEY);
      req.body.userData = userData;
      return next();
    } catch (error) {
      return responseHelper(res, 500, 'Error', error.message, false);
    }
  };
}
export default new TokenHelper();
