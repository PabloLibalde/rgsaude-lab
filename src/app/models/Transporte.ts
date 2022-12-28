import BaseManager from '../../database/BaseManager';
import { transporteSQL, ITRANSPORTE, ITransporte } from './interfaces/transporte';

class Transporte {
  private table = 'TRANSPORTE_PESSOA_VIAGEM';

  private cond = (id: number): { ID: number; } => ({ ID: id });

  public async getAllEmAndamento(page: number, id_usuarios: number[]): Promise<ITransporte[]> {
    const perPage = 10;
    const skip = (page - 1) * perPage;

    const queryResult: ITRANSPORTE[] = await BaseManager.searchQuery(
      transporteSQL.emAndamento(Array(id_usuarios.length).fill('?')), [
        perPage,
        skip,
        ...id_usuarios,
      ],
    );

    return queryResult.map((qr) => ({
      id: qr.ID,
      individuo: qr.CSI_NOMPAC,
      data_agendamento: qr.DATA_AGENDAMENTO,
      data_hora: qr.DATA_HORA,
      destino: qr.NOME_DESTINO,
      ponto_partida: qr.NOME_PARTIDA,
      qtde_passageiros: qr.QTDE_PASSAGEIROS,
      status: qr.STATUS,
      tipo: qr.TIPO,
      veiculo: qr.VEICULO,
    }) as ITransporte);
  }

  public async getAllHistorico(page: number, id_usuarios: number[]): Promise<ITransporte[]> {
    const perPage = 10;
    const skip = (page - 1) * perPage;

    const queryResult: ITRANSPORTE[] = await BaseManager.searchQuery(
      transporteSQL.historico(Array(id_usuarios.length).fill('?')), [
        perPage,
        skip,
        ...id_usuarios,
      ],
    );

    return queryResult.map((qr) => ({
      id: qr.ID,
      individuo: qr.CSI_NOMPAC,
      data_agendamento: qr.DATA_AGENDAMENTO,
      data_hora: qr.DATA_HORA,
      destino: qr.NOME_DESTINO,
      ponto_partida: qr.NOME_PARTIDA,
      qtde_passageiros: qr.QTDE_PASSAGEIROS,
      status: qr.STATUS,
      tipo: qr.TIPO,
      veiculo: qr.VEICULO,
    }) as ITransporte);
  }

  /**
   * Atualiza um registro de transporte
   *
   * @param id Id do transporte
   * @param itens Itens para atualizar
   *
   * @example itens = { name: 'user name' }
   */
  public async update(cond: ITRANSPORTE, itens: ITRANSPORTE): Promise<boolean> {
    return BaseManager.update(this.table, cond, itens);
  }
}

export default new Transporte();
