import BaseManager from '../../database/BaseManager';
import {
  ITipoAgenda, tipoAgendaSQL,
  IRG_SAUDE_TIPO_AGENDA,
} from './interfaces/tipoAgenda';

class TipoAgenda {
  private table = 'RG_SAUDE_TIPOS_AGENDA';

  public async getAllTipoAgenda(): Promise<ITipoAgenda[]> {
    const queryResult: IRG_SAUDE_TIPO_AGENDA[] = await BaseManager.searchQuery(
      tipoAgendaSQL.tipoAgenda,
    );

    if (queryResult) {
      return queryResult.map((qr) => ({
        id: qr.ID,
        descricao: qr.DESCRICAO,
        cbo: qr.CBO,
        id_unidade: qr.ID_UNIDADE,
        unidade: qr.UNIDADE,
        ativo: qr.ATIVO,
      }) as ITipoAgenda);
    }

    return [];
  }

  public async find(id: number): Promise<ITipoAgenda> {
    const queryResult: IRG_SAUDE_TIPO_AGENDA = await BaseManager.search(
      this.table, { ID: id }, '', true,
    );

    const agenda: ITipoAgenda = {
      id: queryResult.ID,
      descricao: queryResult.DESCRICAO,
      id_unidade: queryResult.ID_UNIDADE,
      ativo: queryResult.ATIVO,
    };

    return agenda;
  }
}

export default new TipoAgenda();
