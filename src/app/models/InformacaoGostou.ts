import BaseManager from '../../database/BaseManager';

import { IRG_SAUDE_INFORMACAO_GOSTOU } from './interfaces/informacao';

class InformacaoGostou {
  private table = 'RG_SAUDE_INFORMACAO_GOSTOU';

  public async insert(itens: IRG_SAUDE_INFORMACAO_GOSTOU): Promise<boolean> {
    const executed = await BaseManager.insert(this.table, itens);

    return executed || false;
  }

  public async delete(id_usuario: number, id_informacao: number): Promise<boolean> {
    const executed = await BaseManager.delete(this.table, {
      ID_USUARIO: id_usuario,
      ID_INFORMACAO: id_informacao,
    });

    return executed || false;
  }
}

export default new InformacaoGostou();
