import BaseManager from '../../database/BaseManager';
import {
  IAgenda, ILISTA_AGENDA,
  agendaSQL,
  IRG_SAUDE_AGENDA,
  IRg_Saude_Agenda,
} from './interfaces/agenda';

class Agenda {
  private table = 'RG_SAUDE_AGENDA';

  private cond = (value: number): { ID: number } => ({ ID: value });

  /**
   * Busca todos os agendamentos por usuários
   * @param page paginação
   * @param id_pacientes usuario e pesssoas vinculadas
   */
  public async getAllAgendas(page: number, id_pacientes: number[]): Promise<IAgenda[]> {
    const perPage = 10;
    const skip = (page - 1) * perPage;

    const queryResult: ILISTA_AGENDA[] = await
    BaseManager.searchQuery(agendaSQL.agenda(Array(id_pacientes.length).fill('?')), [
      perPage,
      skip,
      ...id_pacientes,
    ]);

    if (queryResult && queryResult.length > 0) {
      return queryResult.map((qr) => ({
        id: qr.ID,
        id_paciente: qr.ID_PACIENTE,
        paciente: qr.PACIENTE,
        id_unidade: qr.ID_UNIDADE,
        unidade: qr.UNIDADE,
        id_tipo_agenda: qr.ID_TIPO_AGENDA,
        tipo_agenda: qr.TIPO_AGENDA,
        ativo: qr.ATIVO,
        data_solicitacao: qr.DATA_SOLICITACAO,
        situacao: qr.SITUACAO.trim(),
      }) as IAgenda);
    }

    return [];
  }

  /**
   * @param itens
   *
   * @example itens = { id: 1, id_paciente: 117 }
   */
  public async insert(itens: IRG_SAUDE_AGENDA): Promise<boolean> {
    const exectud = BaseManager.insert(this.table, itens);
    return exectud || false;
  }

  /**
   * Atualiza os dados do agendamento
   * @param id
   * @param itens
   */
  public async update(id: number, itens: IRG_SAUDE_AGENDA): Promise<boolean> {
    const executed = await BaseManager.update(this.table, this.cond(id), itens);
    return executed || false;
  }

  public async find(id: number): Promise<IRg_Saude_Agenda> {
    const queryResult: IRG_SAUDE_AGENDA = await BaseManager.search(
      this.table, { ID: id }, '', true,
    );

    const agenda: IRg_Saude_Agenda = {
      id_paciente: queryResult.ID_PACIENTE,
      id_tipo_agenda: queryResult.ID_TIPO_AGENDA,
      situacao: queryResult.SITUACAO,
    };

    return agenda;
  }
}

export default new Agenda();
