import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import responseHelper from '../utils/responseHelper';
const { SECRETE_KEY, NODE_ENV } = process.env;

export interface tokenExpirationType {
  expiresIn: string;
}
class TokenHelper {
  constructor() {}
  createToken = (
    data: object,
    expiresIn: tokenExpirationType,
    secreteKey: string
  ): string => {
    return jwt.sign(data, secreteKey, expiresIn);
  };
  verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const token =
        req.headers.authorization || req.body.token || req.params.token;
      if (!token) {
        return responseHelper(res, 403, 'Fail', 'No token was provided', false);
      }
      const userData: string | object = await jwt.verify(token, SECRETE_KEY);
      req.body.userData = userData;
      return next();
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
  verifyResetPasswordToken = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { token } = req.params;
    jwt.verify(token, SECRETE_KEY, (err: any, decoded: object) => {
      if (err) {
        return responseHelper(res, 400, 'Error', err.message, false);
      }
      return next();
    });
  };
}
export default new TokenHelper();
