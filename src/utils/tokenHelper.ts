import * as jwt from 'jsonwebtoken';
// import {  } from "js";

export const createToken = (
  data: object,
  expiresIn: object,
  secreteKey: string
): string => {
  return jwt.sign(data, secreteKey, expiresIn);
};
