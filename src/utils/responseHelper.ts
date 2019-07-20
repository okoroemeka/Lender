import { Response } from 'express';

const response = (
  res: Response,
  code: number,
  status: string,
  data: object | string,
  resType: boolean
): object => {
  return res.status(code).json({
    status: status,
    [resType ? 'data' : 'message']: data
  });
};

export default response;
