import { Request, Response, NextFunction } from 'express';

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
  // const data = Object.keys(userInput);
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
