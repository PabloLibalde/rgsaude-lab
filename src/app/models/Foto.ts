import BaseManagerFotos from '../../database/BaseManagerFotos';
import { IFoto } from './interfaces/foto';

class Usuario {
  private table = 'TSI_FOTOS';

  private cond = (value: number): { CSI_ID: number } => ({ CSI_ID: value });

  public async getAll(page: number): Promise<IFoto[]> {
    const perPage = 30;
    const skip = (page - 1) * perPage;

    const queryResult = await BaseManagerFotos.search(this.table, null, null, false, {
      first: perPage, skip,
    });

    if (queryResult && queryResult.length > 0) {
      return queryResult.map((f: any) => ({
        id: f.CSI_ID,
        id_usuario: f.CSI_MATRICULA,
        tipo_usuario: f.CSI_TIPO,
        foto: f.CSI_FOTO,
      } as IFoto));
    }
    return [];
  }

  /**
   * Busca registro de usuário pelo Id
   *
   * @param id Id do usuário
   */
  public async find(id: number): Promise<IFoto> {
    const queryResult = await BaseManagerFotos.search(this.table, {
      CSI_MATRICULA: id,
    }, null, true);

    if (queryResult) {
      const foto: IFoto = {
        id: queryResult.CSI_ID,
        id_usuario: queryResult.CSI_MATRICULA,
        blobFoto: queryResult.CSI_FOTO,
        data_alteracao: new Date(queryResult.DATA_ALTERACAO),
      };
      return foto;
    }
    return {} as IFoto;
  }

  /**
   * Insere um registro de usuário
   *
   * @param itens Itens pata inserir
   *
   * @example itens = { name: 'user name' }
   */
  public async insert(itens: Record<string, any>): Promise<boolean> {
    const executed = await BaseManagerFotos.insert(this.table, itens);
    return executed || false;
  }

  /**
   * Atualiza registro da tabela TSI_FOTOS
   *
   * @param idusuario Id do usuário a quem pertence a foto
   * @param items Itens para atualizar
   */
  public async update(idusuario: number, items: Record<string, any>): Promise<boolean> {
    const executed = await BaseManagerFotos.update('TSI_FOTOS', {
      CSI_MATRICULA: idusuario,
    }, items);

    return !!executed;
  }

  public async insertBlob(itens: any[]): Promise<boolean> {
    const executed = await BaseManagerFotos.insert(this.table, itens);
    return executed || false;
  }
}

export default new Usuario();
