import { Request, Response, NextFunction } from 'express';
import responseHelper from '../utils/responseHelper';

interface arg {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  address: string;
  [key: string]: string;
}
/**
 * Validates user inputs.
 * @param req
 * @param res
 * @param next
 */
export const checkInputFields = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const userInput: arg = req.body;
  const emptyFields: Array<string> = [];
  const fieldRequired: Array<string> =
    req.path === '/auth/signup'
      ? ['lastName', 'firstName', 'email', 'password', 'address']
      : ['email', 'password'];

  fieldRequired.forEach(field => {
    if (!userInput[field] || !userInput[field].trim().length) {
      emptyFields.push(field);
    }
  });
  if (emptyFields.length) {
    return res.status(402).json({
      status: 'Fail',
      message: `The ${
        emptyFields.length > 1
          ? `${emptyFields.slice(0, emptyFields.length - 1).join()} and ${
              emptyFields[emptyFields.length - 1]
            }`
          : emptyFields.join()
      } field${emptyFields.length > 1 ? 's' : ''} ${
        emptyFields.length > 1 ? 'are' : 'is'
      } required.`
    });
  }
  return next();
};

/**
 * Validates user inputs.
 * @param req
 * @param res
 * @param next
 */
export const checkLoanField = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { tenor, amount }: any = req.body;
  if (!tenor || isNaN(tenor)) {
    return responseHelper(
      res,
      400,
      'Fail',
      'The tenor field is required and must be a number',
      false
    );
  }
  if (tenor < 1 || tenor > 12) {
    return responseHelper(
      res,
      400,
      'Fail',
      'tenor must be a number between 1 and 12',
      false
    );
  }
  if (!amount || isNaN(amount) || amount < 0) {
    return responseHelper(
      res,
      400,
      'Fail',
      'The amount field is required and must be a number greater than 0',
      false
    );
  }
  return next();
};

export const checkPasswordFields = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { newPassword, confirmNewPassword } = req.body;
  if (!newPassword || !confirmNewPassword) {
    return responseHelper(
      res,
      400,
      'Error',
      'The password fields are required',
      false
    );
  }
  if (newPassword.trim().length < 1 || confirmNewPassword.trim().length < 1) {
    return responseHelper(
      res,
      400,
      'Error',
      'The password fields can not be empty',
      false
    );
  }
  if (newPassword !== confirmNewPassword) {
    return responseHelper(
      res,
      400,
      'Error',
      'The passwords do not match',
      false
    );
  }
  return next();
};
