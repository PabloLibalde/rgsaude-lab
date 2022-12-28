import BaseManager from '../../database/BaseManager';
import {
  IInformacaoFeedback,
  IRG_SAUDE_INFORMACAO_FEEDBACK,
  informacaoSQL,
} from './interfaces/informacao';

class InformacaoFeedback {
  private table = 'RG_SAUDE_INFORMACAO_FEEDBACK';

  private generator = 'GEN_RG_SAUDE_INFO_FEEDBACK';

  private cond = (value: number): { ID: number } => ({ ID: value });

  /**
   * Busca ultimo registro de feedback da informação
   *
   * @param id_informacao Id da informação
   */
  public async findOneByInfo(id_informacao: number): Promise<IInformacaoFeedback> {
    const queryResult: IRG_SAUDE_INFORMACAO_FEEDBACK = await BaseManager.searchQuery(
      informacaoSQL.ultimoFeedbackInformacao, [id_informacao], true,
    );

    if (queryResult) {
      const feedback: IInformacaoFeedback = {
        id: queryResult.ID,
        nome_usuario: queryResult.NOME_USUARIO,
        texto: queryResult.TEXTO,
        criado_em: queryResult.CRIADO_EM,
      };
      return feedback;
    }
    return {} as IInformacaoFeedback;
  }

  /**
   * Busca todos registros de feedback de uma informação em order decrescente por data
   *
   * @param id_informacao Id da informação
   */
  public async findAllByInfo(id_informacao: number): Promise<IInformacaoFeedback[]> {
    const queryResult: IRG_SAUDE_INFORMACAO_FEEDBACK[] = await BaseManager.searchQuery(
      informacaoSQL.feedbacksInformacao, [id_informacao],
    );

    if (queryResult && queryResult.length > 0) {
      return queryResult.map((feedback) => ({
        id: feedback.ID,
        texto: feedback.TEXTO,
        id_usuario: feedback.ID_USUARIO,
        nome_usuario: feedback.NOME_USUARIO,
        criado_em: feedback.CRIADO_EM,
      }) as IInformacaoFeedback);
    }

    return [];
  }

  public async insert(itens: IRG_SAUDE_INFORMACAO_FEEDBACK): Promise<boolean> {
    const executed = await BaseManager.insert(this.table, itens);
    return executed || false;
  }

  public async delete(id_feedback): Promise<boolean> {
    const executed = await BaseManager.delete(this.table, {
      ID: id_feedback,
    } as IRG_SAUDE_INFORMACAO_FEEDBACK);

    return executed || false;
  }

  public async genId(): Promise<number> {
    return BaseManager.genId(this.generator);
  }
}

export default new InformacaoFeedback();
