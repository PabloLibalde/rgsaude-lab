/* eslint-disable no-multi-spaces */

export interface IInformacaoFeedback {
  id: number;               // ID
  id_informacao?: number;    // ID_INFORMACAO
  id_usuario?: number;      // ID_USUARIO
  avatar_usuario?: Blob | Buffer | Function | string;
  nome_usuario: string;    // NOME_USUARIO
  texto: string;            // TEXTO
  criado_em: string | Date; // CRIADO_EM
}

export interface IInformacao {
  id: number;                     // ID
  titulo: string;                 // TITULO
  texto?: string;                 // TEXTO
  evento?: number | boolean;      // FLG_EVENTO
  blobImagem?: Function;          // IMAGEM
  criado_em?: string | Date;      // CRIADO_EM
  atualizado_em?: string | Date;  // ATUALIZADO_EM
  imagem_url?: string;
  gostou?: boolean;
  quantidade_gostou?: number;
  quantidade_feedback?: number;
  ultimo_feedback: IInformacaoFeedback;
}

export interface IInformcaoGostou {
  id_informacao: number;
  id_usuario: number;
  criado_em: string | Date;
}

export interface IRG_SAUDE_INFORMACAO_FEEDBACK {
  ID?: number;
  ID_INFORMACAO?: number;
  ID_USUARIO?: number;
  TEXTO?: string;
  CRIADO_EM?: string | Date;
  NOME_USUARIO?: string;
}

export interface IRG_SAUDE_INFORMACAO {
  ID?: number;
  TITULO?: string;
  TEXTO?: string;
  IMAGEM?: Blob | Function | Buffer;
  FLG_EVENTO?: number | boolean;
  CRIADO_EM?: string | Date;
  ATUALIZADO_EM?: string | Date;
  QTD_GOSTOU?: number;
  QTD_FEEDBACK?: number;
  GOSTOU?: number | boolean;
}

export interface IRG_SAUDE_INFORMACAO_GOSTOU {
  ID_INFORMACAO: number;
  ID_USUARIO: number;
  CRIADO_EM: string | Date;
}

export enum informacaoSQL {
  /**
   * @params [id_usuario]
   */
  quantidadeGostouSQL = 'SELECT COUNT(*) qtd_gostou FROM RG_SAUDE_INFORMACAO_GOSTOU WHERE ID = ?',

  /**
   * @params [perPage, offset, id_usuario]
   */
  informacoes = 'SELECT FIRST ? SKIP ? INFO.*, (SELECT COUNT(*) FROM RG_SAUDE_INFORMACAO_GOSTOU WHERE ID_INFORMACAO = INFO.ID) QTD_GOSTOU, (SELECT COUNT(*) FROM RG_SAUDE_INFORMACAO_FEEDBACK WHERE ID_INFORMACAO = INFO.ID) QTD_FEEDBACK, (SELECT COUNT(*) FROM RG_SAUDE_INFORMACAO_GOSTOU WHERE ID_INFORMACAO = INFO.ID AND ID_USUARIO = ?) GOSTOU FROM RG_SAUDE_INFORMACAO INFO ORDER BY INFO.CRIADO_EM DESC',

  /**
   * @params [id_informacao]
   */
  ultimoFeedbackInformacao = 'SELECT FIRST 1 FEED.*, USU.NOME NOME_USUARIO FROM RG_SAUDE_INFORMACAO_FEEDBACK FEED INNER JOIN RG_SAUDE_USUARIO USU ON FEED.ID_USUARIO = USU.ID WHERE FEED.ID_INFORMACAO = ? ORDER BY FEED.CRIADO_EM DESC',

  /**
   * @params [id_informacao]
   */
  feedbacksInformacao = 'SELECT FEED.*, USU.NOME NOME_USUARIO FROM RG_SAUDE_INFORMACAO_FEEDBACK FEED INNER JOIN RG_SAUDE_USUARIO USU ON FEED.ID_USUARIO = USU.ID WHERE FEED.ID_INFORMACAO = ? ORDER BY FEED.CRIADO_EM',
}
