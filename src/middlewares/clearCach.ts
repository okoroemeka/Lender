import { Request, Response, NextFunction } from 'express';
import { clearCache } from '../services/cache';

const clearCachMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await next();
  console.log('I ran here 🥵🥵🥵', req.body.email);
  clearCache.clearHash(req.body.userData.userId);
};

export default clearCachMiddleware;
