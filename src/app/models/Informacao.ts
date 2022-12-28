import BaseManager from '../../database/BaseManager';

import { IInformacao, IRG_SAUDE_INFORMACAO, informacaoSQL } from './interfaces/informacao';

class Informacao {
  private table = 'RG_SAUDE_INFORMACAO';

  private cond = (value: number): { ID: number } => ({ ID: value });

  public async getAll(page: number, id_usuario: number): Promise<IInformacao[]> {
    const perPage = 10;
    const offset = (page - 1) * perPage;

    const queryResult = await BaseManager.searchQuery(informacaoSQL.informacoes, [
      perPage, offset, id_usuario,
    ]);

    if (queryResult && queryResult.length > 0) {
      return queryResult.map((qr: IRG_SAUDE_INFORMACAO) => ({
        id: qr.ID,
        titulo: qr.TITULO,
        texto: qr.TEXTO,
        blobImagem: qr.IMAGEM,
        evento: !!qr.FLG_EVENTO,
        criado_em: qr.CRIADO_EM,
        atualizado_em: qr.ATUALIZADO_EM,
        quantidade_gostou: qr.QTD_GOSTOU,
        quantidade_feedback: qr.QTD_FEEDBACK,
        gostou: !!qr.GOSTOU,
      } as IInformacao));
    }
    return [] as IInformacao[];
  }

  /**
   * Insere um registro de informação
   *
   * @param itens Itens pata inserir
   *
   * @example itens = { name: 'user name' }
   */
  public async insert(itens: IRG_SAUDE_INFORMACAO): Promise<boolean> {
    const executed = await BaseManager.insert(this.table, itens);
    return executed || false;
  }
}

export default new Informacao();
