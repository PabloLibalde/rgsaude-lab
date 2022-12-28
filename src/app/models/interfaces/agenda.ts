export interface IAgenda {
  id?: number;
  id_paciente?: number;
  paciente?: string;
  data_solicitacao?: Date | string;
  situacao?: string;
  id_tipo_agenda?: number;
  tipo_agenda?: string;
  id_unidade?: number;
  unidade?: string;
  ativo?: number;
}

export interface IRg_Saude_Agenda {
  id_paciente?: number;
  data_solicitacao?: Date | string;
  situacao?: number;
  id_tipo_agenda?: number;
  id_unidade?: number;
  obs?: string;
}

export interface ILISTA_AGENDA {
  ID?: number;
  ID_PACIENTE?: number;
  PACIENTE?: string;
  DATA_SOLICITACAO?: Date | string;
  SITUACAO?: string;
  ID_TIPO_AGENDA?: number;
  TIPO_AGENDA?: string;
  ID_UNIDADE?: number;
  UNIDADE?: string;
  ATIVO?: number;
}

export interface IRG_SAUDE_AGENDA {
  ID_PACIENTE?: number;
  DATA_SOLICITACAO?: Date | string;
  SITUACAO?: number;
  ID_TIPO_AGENDA?: number;
  ID_UNIDADE?: number;
  OBS?: string;
}

export const agendaSQL = {
  agenda: (id_pacientes: number[]): string => 'SELECT FIRST ? SKIP ? '
  + 'A.ID, A.ID_PACIENTE, P.CSI_NOMPAC PACIENTE, '
  + 'A.DATA_SOLICITACAO, CASE A.SITUACAO '
  + "WHEN 0 THEN 'SOLICITADO' "
  + "WHEN 1 THEN 'AGENDADO' "
  + "ELSE 'CANCELADO' "
  + 'END SITUACAO, A.ID_TIPO_AGENDA, TA.DESCRICAO TIPO_AGENDA, '
  + 'TA.ID_UNIDADE, U.CSI_NOMUNI UNIDADE, TA.FLG_ATIVO ATIVO '
  + 'FROM RG_SAUDE_AGENDA A '
  + 'JOIN TSI_CADPAC P ON A.ID_PACIENTE = P.CSI_CODPAC '
  + 'JOIN RG_SAUDE_TIPOS_AGENDA TA ON A.ID_TIPO_AGENDA = TA.ID '
  + 'LEFT JOIN TSI_UNIDADE U ON TA.ID_UNIDADE = U.CSI_CODUNI '
  + `WHERE A.ID_PACIENTE IN (${id_pacientes.join(', ')}) `
  + 'ORDER BY A.DATA_SOLICITACAO DESC ',
};
