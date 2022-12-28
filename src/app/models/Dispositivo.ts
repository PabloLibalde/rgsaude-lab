import { IDispositivoInterface } from './interfaces/dispositivo';
import BaseManager from '../../database/BaseManager';

class Dispositivo {
  private table = 'RG_SAUDE_DISPOSITIVO';

  private cond = (value: number): { ID: number } => ({ ID: value })

  public async getAll(page?: number): Promise<IDispositivoInterface[]> {
    const queryResult = await BaseManager.search(this.table);

    if (queryResult && queryResult.length > 0) {
      return queryResult.map((qr: any) => ({
        id: qr.ID,
        id_dispositivo: qr.ID_DISPOSITIVO,
        id_usuario: qr.ID_INDIVIDUO,
        ultimo_acesso: new Date(qr.ULTIMO_ACESSO),
      } as IDispositivoInterface));
    }
    return [] as IDispositivoInterface[];
  }


  /**
   * Busca registro de dispositivo pelo Id
   *
   * @param id Id do dispositivo
   */
  public async find(id: number): Promise<IDispositivoInterface> {
    const queryResult = await BaseManager.search(this.table, this.cond(id), 'CSI_NOMPAC', true);

    if (queryResult) {
      return {
        id: queryResult.ID,
        id_dispositivo: queryResult.ID_DISPOSITIVO,
        id_usuario: queryResult.ID_INDIVIDUO,
        ultimo_acesso: new Date(queryResult.ULTIMO_ACESSO),
      } as IDispositivoInterface;
    }
    return {} as IDispositivoInterface;
  }

  /**
   * Atualiza um registro de dispositivo
   *
   * @param id Id do dispositivo
   * @param itens Itens para atualizar
   *
   * @example itens = { name: 'user name' }
   */
  public async update(id: number, itens: Record<string, any>): Promise<boolean> {
    const executed = await BaseManager.update(this.table, this.cond(id), itens);
    return executed || false;
  }

  /**
   * Insere um registro de dispositivo
   *
   * @param itens Itens pata inserir
   *
   * @example itens = { name: 'user name' }
   */
  public async insert(itens: Record<string, any>): Promise<boolean> {
    const executed = await BaseManager.insert(this.table, itens);
    return executed || false;
  }

  /**
   * Atualizar ou insere um registro de dispositivo
   *
   * @param itens Itens pata atualizar/inserir
   * @param matching Colunas para verificar se deve ser feito update ou insert
   *
   * @example itens = { name: 'user name' }
   * @example matching = ['FIELD_01', 'FIELD_02', ...]
   */
  public async updateOrInsert(itens: Record<string, any>, matching: string[]): Promise<boolean> {
    const executed = await BaseManager.updateOrInsert(this.table, itens, matching);
    return executed || false;
  }
}

export default new Dispositivo();
