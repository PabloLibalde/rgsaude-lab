/* eslint-disable no-await-in-loop */
import BaseManager from '../../database/BaseManager';

import {
  medicamentoSQL,
  ISAIDA_MEDICAMENTO,
  IITEM_MEDICAMENTO,
  IMedicamento,
  IMedicamentoItem,
} from './interfaces/medicamento';

class Medicamento {
  public async getHistorico(page: number, id_usuarios: number[]): Promise<IMedicamento[]> {
    const perPage = 10;
    const skip = (page - 1) * perPage;

    const queryResult: ISAIDA_MEDICAMENTO[] = await BaseManager.searchQuery(
      medicamentoSQL.historicoSaida(Array(id_usuarios.length).fill('?')), [
        perPage,
        skip,
        ...id_usuarios,
      ],
    );

    if (queryResult && queryResult.length > 0) {
      return queryResult.map((qr) => ({
        id: qr.CSI_CODSAIDA,
        individuo: qr.CSI_NOMPAC,
        data: qr.CSI_DATA,
        medico: qr.CSI_MEDICO,
        medico_especialidade: qr.CSI_DESESP,
        usuario: qr.NOME,
      }) as IMedicamento);
    }
    return [];
  }

  public async getMedicamentos(id_saida: number): Promise<IMedicamentoItem[]> {
    const queryResult: IITEM_MEDICAMENTO[] = await BaseManager.searchQuery(
      medicamentoSQL.medicamentosSaida, [id_saida],
    );

    // const getText = async (blobFunction: Function): Promise<string|null> => {
    //   const buffer = await blobToBuffer(blobFunction);
    //   return buffer.toString();
    // };

    if (queryResult && queryResult.length > 0) {
      return queryResult.map((qr) => ({
        id: qr.CSI_CODIGO,
        medicamento: qr.CSI_NOMMED,
        periodo_uso: qr.CSI_PERIODO_USO,
        quantidade: qr.CSI_QTDE,
        modo_uso: null,
      }) as IMedicamentoItem);
    }
    return [];
  }
}

export default new Medicamento();
