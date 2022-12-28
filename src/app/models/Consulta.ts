import BaseManager from '../../database/BaseManager';
import { consultaSQL, IConsulta, ICONSULTA } from './interfaces/consulta';

class Consulta {
  private table = 'TSI_CONSULTAS';

  private cond = (id: number): { CSI_CONTROLE: number; } => ({ CSI_CONTROLE: id });

  public async getAllAndamento(page: number, id_usuarios: number[]): Promise<IConsulta[]> {
    const perPage = 10;
    const skip = (page - 1) * perPage;

    const queryResult: ICONSULTA[] = await BaseManager.searchQuery(
      consultaSQL.emAndamento(Array(id_usuarios.length).fill('?')), [
        perPage,
        skip,
        ...id_usuarios,
      ],
    );

    if (queryResult && queryResult.length > 0) {
      return queryResult.map((qr) => ({
        id: qr.CSI_CONTROLE,
        individuo: qr.CSI_NOMPAC,
        data_agendamento: qr.CSI_DATAAG,
        data_consulta: qr.DATA_CONSULTA,
        horario: qr.CSI_HORARIO,
        status: qr.CSI_STATUS.trim(),
        local: qr.UNIDADE,
        medico: qr.CSI_NOMMED,
        medico_especialidade: qr.CBO_PROFISSIONAL.trim(),
        tipo_atendimento: 'CONSULTA AGENDADA',
      }) as IConsulta);
    }
    return [];
  }

  public async getAllHistorico(page: number, id_usuarios: number[]): Promise<IConsulta[]> {
    const perPage = 10;
    const skip = (page - 1) * perPage;

    const queryResult: ICONSULTA[] = await BaseManager.searchQuery(
      consultaSQL.historico(Array(id_usuarios.length).fill('?')), [
        perPage,
        skip,
        ...id_usuarios,
      ],
    );

    if (queryResult && queryResult.length > 0) {
      return queryResult.map((qr) => ({
        id: qr.CSI_CONTROLE,
        individuo: qr.CSI_NOMPAC,
        data_agendamento: qr.CSI_DATAAG,
        data_consulta: qr.DATA_CONSULTA,
        horario: qr.CSI_HORARIO,
        status: qr.CSI_STATUS,
        local: qr.UNIDADE,
        medico: qr.CSI_NOMMED,
        medico_especialidade: qr.CBO_PROFISSIONAL.trim(),
        tipo_atendimento: qr.TIPO_ATENDIMENTO.trim(),
      }) as IConsulta);
    }
    return [];
  }

  /**
   * Atualiza um registro de consulta
   *
   * @param id Id da consulta
   * @param itens Itens para atualizar
   *
   * @example itens = { name: 'user name' }
   */
  public async update(id: number, itens: ICONSULTA): Promise<boolean> {
    return BaseManager.update(this.table, this.cond(id), itens);
  }
}

export default new Consulta();
