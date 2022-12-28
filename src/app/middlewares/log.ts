import { Request, Response, NextFunction } from 'express';
import { databases } from '../../config/databaseConfig';

export default (req: Request, res: Response, next: NextFunction): void => {
  const { ibge } = req.headers;

  const [database] = databases.filter((d) => d.ibge === ibge);

  if (database) {
    console.log(`New request from ${database.municipio}, at ${new Date()} from route ${req.originalUrl}`);
  }

  next();
};
