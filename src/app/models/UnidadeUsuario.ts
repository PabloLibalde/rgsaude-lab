import BaseManager from '../../database/BaseManager';

import { ITSI_UNIDADE, IUnidade, unidadeUsuarioSQL } from './interfaces/unidadeUsuario';

class UnidadeUsuario {
  public async getUnidadeUsuario(id_usuario: number): Promise<IUnidade> {
    const queryResult: ITSI_UNIDADE = await BaseManager.searchQuery(
      unidadeUsuarioSQL.unidadeUsuario(id_usuario), [], true,
    );

    if (queryResult) {
      const unidade: IUnidade = {
        id: queryResult.CSI_CODUNI,
        nome_unidade: queryResult.CSI_NOMUNI,
      };

      return unidade;
    }

    return {} as IUnidade;
  }
}

export default new UnidadeUsuario();
