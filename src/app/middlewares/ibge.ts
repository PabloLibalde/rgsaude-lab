import { Request, Response, NextFunction } from 'express';
import * as HTTP from 'http-status-codes';

import BaseManager from '../../database/BaseManager';
import BaseManagerFotos from '../../database/BaseManagerFotos';

import { databases } from '../../config/databaseConfig';

/**
 * Valida se foi recebido o IBGE do município no Header
 *
 * Caso tenha recebido, seta para uso no BaseManager
 */
export default async (req: Request, res: Response, next: NextFunction): Promise<Response|any> => {
  const ibgeHeader = req.headers.ibge;

  if (!ibgeHeader) {
    return res.status(HTTP.BAD_REQUEST).json({ message: 'City IBGE not provided' });
  }

  const available = databases.findIndex((db) => db.ibge === ibgeHeader);

  if (available < 0) {
    return res.status(HTTP.BAD_REQUEST).json({ message: 'City IBGE provided not available' });
  }

  BaseManager.setIBGE(String(ibgeHeader));
  BaseManagerFotos.setIBGE(String(ibgeHeader));

  next();
};
