/* eslint-disable no-await-in-loop */
import * as Firebird from 'node-firebird';
import { databasesFotos } from '../config/databaseConfig';

interface IConnection {
  municipio: string;
  ibge: string;
  database: Firebird.ConnectionPool;
  databaseFotos?: Firebird.ConnectionPool;
}

class DatabaseFotos {
  protected databaseFotosPools: IConnection[] = [];

  public constructor() {
    this.initConnectionFotos = this.initConnectionFotos.bind(this);
    this.initConnectionFotos();
  }


  private async initConnectionFotos(): Promise<void> {
    const numSockets = 10;

    for (const database of databasesFotos) {
      try {
        const pool = Firebird.pool(numSockets, database.databaseOptions);

        await this.testConnection(pool);

        this.databaseFotosPools.push({
          municipio: database.municipio,
          ibge: database.ibge,
          database: pool,
        });

        console.log(`Database Fotos pool connection at ${database.municipio} successfull!`);
      } catch (ex) {
        console.error(`Database Fotos pooling connection error at ${database.municipio} =>`, ex.message);
      }
    }
  }

  /**
   * Testa conexão com o banco de dados
   * @param pool
   */
  private testConnection(pool: Firebird.ConnectionPool): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.get((err, db) => {
        if (err) return reject(err);

        db.detach(); // close connection

        return resolve(true);
      });
    });
  }
}

export default DatabaseFotos;
