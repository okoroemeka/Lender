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
  const data = Object.keys(userInput);
  const emptyFields: Array<string> = [];
  data.forEach(field => {
    if (!userInput[field].length) {
      emptyFields.push(field);
    }
  });
  if (emptyFields.length) {
    return res.status(402).json({
      status: 'Fail',
      message: `The ${emptyFields.join()} field${
        emptyFields.length > 1 ? 's' : ''
      } ${emptyFields.length > 1 ? 'are' : 'is'} required.`
    });
  }
  return next();
};
