export interface ITipoAgenda {
  id?: number;
  descricao?: string;
  cbo?: string;
  id_unidade?: number;
  unidade?: string;
  ativo?: number;
}

export interface IRG_SAUDE_TIPO_AGENDA {
  ID?: number;
  DESCRICAO?: string;
  CBO?: string;
  ID_UNIDADE?: number;
  UNIDADE?: string;
  ATIVO?: number;
}

export const tipoAgendaSQL = {
  tipoAgenda:
  ' SELECT TA.ID, TA.DESCRICAO, TAC.CBO, TA.ID_UNIDADE, U.CSI_NOMUNI UNIDADE,'
    + 'TA.FLG_ATIVO ATIVO '
  + 'FROM RG_SAUDE_TIPOS_AGENDA TA '
  + 'LEFT JOIN TSI_UNIDADE U ON TA.ID_UNIDADE = U.CSI_CODUNI '
  + 'JOIN RG_SAUDE_TIPOS_AGENDA_CBO TAC ON TAC.ID_TIPO_AGENDA_MOBILE = TA.ID '
  + 'WHERE TA.FLG_ATIVO = 1',
};
