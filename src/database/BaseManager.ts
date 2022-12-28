/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Firebird from 'node-firebird';
import Database from './Database';

class BaseManager extends Database {
  private ibge: string;

  /**
   * Seta IBGE que será usado para selecionar o banco de dados para conexão/consulta
   *
   * @param ibge
   */
  public setIBGE(ibge: string): void {
    this.ibge = ibge;
  }

  /**
   * Retorna o IBGE usado no momento
   */
  public getIBGE(): string {
    return this.ibge;
  }

  /**
   * Insere registro em uma tabela
   *
   * @param table Tabela para inserir
   * @param itens Itens pata inserir
   *
   * @example itens = { fieldName: 'fieldValue', ... }
   */
  public async insert(table: string, itens: {}): Promise<any> {
    // Nomes dos campos
    const fields = Object.keys(itens).map((field) => field);

    // Parâmetros/valores
    const parameters = Object.values(itens).map((value) => value);
    const labeledParameters = Array(parameters.length).fill('?');

    // SQL
    const sql = `
      INSERT INTO ${table}(${fields.join(', ')}) 
      VALUES(${labeledParameters.join(', ')})
    `;

    // console.log('INSERT SQL', sql);

    const dbInstance = await this.getConnection();

    return new Promise((resolve, reject) => {
      dbInstance.execute(sql, parameters, (err) => {
        dbInstance.detach(); // close connection

        if (!err) {
          return resolve(true);
        }

        return reject(err);
      });
    });
  }

  /**
   * Insere ou atualiza um registro em uma tabela a partir das condições fornecidas em matching
   *
   * @param table Tabela para atualizar/inserir
   * @param itens Itens pata atualizar/inserir
   *
   * @example itens = { fieldName: 'fieldValue', ... }
   */
  public async updateOrInsert(table: string, itens: {}, matching: string[]): Promise<boolean> {
    // Nomes dos campos
    const fields = Object.keys(itens).map((field) => field);

    // Parâmetros/valores
    const parameters = Object.values(itens).map((value) => value);
    const labeledParameters = Array(parameters.length).fill('?');

    // SQL
    const sql = `
      UPDATE OR INSERT INTO ${table}(${fields.join(', ')}) 
      VALUES(${labeledParameters.join(', ')})
      MATCHING (${matching.join(', ')})
    `;

    const dbInstance = await this.getConnection();

    return new Promise((resolve, reject) => {
      dbInstance.execute(sql, parameters, (err) => {
        dbInstance.detach(); // close connection

        if (!err) {
          return resolve(true);
        }

        return reject(err);
      });
    });
  }

  /**
   * Faz update no registro
   *
   * @param table Tabela para fazer update
   * @param cond Condicao para update
   * @param itens Itens para update
   *
   * @example cond = { fieldName: value }
   * @example itens = { fieldName: 'user name', ... }
   */
  public async update(table: string, cond: {}, itens: {}): Promise<boolean> {
    // Preparando condição
    const condFields = Object.keys(cond).map((field) => `${field} = ?`);
    const condValues = Object.values(cond).map((value) => value);

    // Motando items e parâmetros para update
    const fields = Object.keys(itens).map((field) => `${field} = ?`);
    const parameters = Object.values(itens).map((value) => value);

    // SQL
    const sql = `UPDATE ${table} SET ${fields.join(', ')} WHERE ${condFields.join(' AND ')}`;

    // console.log('sql update', sql);

    const dbInstance = await this.getConnection();

    return new Promise((resolve, reject) => {
      dbInstance.execute(sql, [...parameters, ...condValues], (err) => {
        dbInstance.detach(); // close connection

        if (!err) {
          return resolve(true);
        }

        console.error('SQL error', err);
        return reject(err);
      });
    });
  }

  /**
   * Busca um ou mais registros em uma tabela
   *
   * @param table Nome da tabela
   * @param cond Condicao de busca
   * @param order Ordenação
   * @param firstLine true|false
   * @param pagination Paginar consulta
   *
   * @example cond = { fieldName: value }
   * @example order = 'fieldName DESC'
   * @example pagination = { first: number, skip: number }
   */
  public async search(
    table: string,
    cond?: {}|null,
    order?: string,
    firstLine?: boolean,
    pagination?: { first: number, skip: number },
  ): Promise<any> {
    // Preparando condição
    const condFields = Object.keys(cond).map((field) => `${field} = ?`);

    const condValues = Object.values(cond).map((value) => value);

    // Paginação
    const firstPage = pagination ? pagination.first : null;
    const skip = pagination ? pagination.skip : null;

    // SQL
    const sql = `SELECT 
      ${firstLine ? 'FIRST 1 ' : ''}
      ${pagination ? `FIRST ${firstPage} SKIP ${skip}` : ''}
        * 
      FROM ${table} 
      ${cond ? `WHERE ${condFields.join(' AND ')}` : ''} 
      ${order ? `ORDER BY ${order}` : ''}
    `;

    // console.log(sql);

    const dbInstance = await this.getConnection();

    return new Promise((resolve, reject) => {
      dbInstance.query(sql, condValues, (err, result) => {
        dbInstance.detach(); // close connection

        if (!err) {
          if (firstLine) return resolve(result[0]);
          return resolve(result);
        }

        return reject(err);
      });
    });
  }

  /**
   * Executa SQL personalizado
   *
   * @param sql SQL para busca
   * @param params Parâmetros do SQL
   * @param firstLine true|false
   *
   * Os parâmetros devem ser informados na mesma ordem que estão na query
   * @example params = [param1, param2, ...];
   */
  public async searchQuery(
    sql: string,
    params?: any[],
    firstLine?: boolean,
  ): Promise<any> {
    // console.log('sql', sql);
    // console.log('params', params);

    const dbInstance = await this.getConnection();

    return new Promise((resolve, reject) => {
      dbInstance.query(sql, params, (err, result) => {
        dbInstance.detach(); // close connection

        if (!err) {
          if (firstLine) return resolve(result[0]);
          return resolve(result);
        }
        return reject(err);
      });
    });
  }

  /**
   *
   * @param sql SQL para execução
   * @param params Parâmetros
   *
   * Os parâmetros devem ser informados na mesma ordem que estão na query
   * @example params = [param1, param2, ...]
   */
  public async executeSql(sql: string, params?: any[]): Promise<any[] | boolean> {
    // console.log('sql', sql);
    // console.log('params', params);

    const dbInstance = await this.getConnection();

    return new Promise((resolve, reject) => {
      dbInstance.query(sql, params, (err, result) => {
        dbInstance.detach(); // close connection

        if (!err) {
          return resolve(result);
        }

        console.error('SQL ERROR', err);
        return reject(err);
      });
    });
  }

  /**
   * Gera Id para o registo de acordo com generator informado
   *
   * @param generator
   */
  public async genId(generator: string): Promise<number> {
    // console.log('generator', generator);

    const dbInstance = await this.getConnection();

    return new Promise((resolve, reject) => {
      dbInstance.query(`SELECT GEN_ID(${generator}, 1) FROM RDB$DATABASE`, null,
        (err, result) => {
          dbInstance.detach(); // close connection

          if (!err) {
            return resolve(result[0].GEN_ID);
          }

          console.error('genId -> ERROR', err);
          return reject(err);
        });
    });
  }

  /**
   *
   * @param table nome da tabela
   * @param cond condições para deletar
   *
   * @example cond = {param1: param1, param2: param2, ...}
   *
   */
  public async delete(table: string, cond: {}): Promise<boolean> {
    // Preparando parâmetros
    const condFields = Object.keys(cond).map((field) => `${field} = ?`);

    const condValues = Object.values(cond).map((value) => value);

    const sql = `
      DELETE FROM ${table} WHERE ${condFields.join(' AND ')}
    `;

    // console.log('sql delete', sql);

    const dbInstance = await this.getConnection();

    return new Promise((resolve, reject) => {
      dbInstance.execute(sql, condValues, (err) => {
        dbInstance.detach(); // close connection

        if (!err) {
          return resolve(true);
        }
        console.error('SQL error', err);
        return reject(err);
      });
    });
  }

  /**
   * Faz conexão com banco de dados de acordo com IBGE fornecido
   */
  private getConnection(): Promise<Firebird.Database> {
    return new Promise((resolve, reject) => {
      const [{ database }] = this.databasePools.filter((dp) => dp.ibge === this.ibge);

      database.get((err, db) => {
        if (err) return reject(err);

        return resolve(db);
      });
    });
  }
}

export default new BaseManager();
