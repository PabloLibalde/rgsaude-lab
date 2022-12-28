import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as HTTP from 'http-status-codes';

import authConfig from '../../config/auth';

function jwtVerify(token: string): Promise<string|object> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, authConfig.secret, {}, (err, decoded) => {
      if (!err) resolve(decoded);
      else reject(err);
    });
  });
}

export default async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response|any> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(HTTP.UNAUTHORIZED).json({ message: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await jwtVerify(token);

    req.userId = decoded.id;

    next();
  } catch (err) {
    return res.status(HTTP.UNAUTHORIZED).json({ message: 'Token provided not is valid' });
  }
};
