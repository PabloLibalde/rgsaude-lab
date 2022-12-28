/* eslint-disable no-multi-spaces */
export interface IConsulta {
  id?: number;
  individuo?: string;
  data_agendamento?: string | Date;
  data_consulta?: string | Date;
  horario?: string | Date;
  status?: string;
  local?: string;
  medico?: string;
  medico_especialidade?: string;
  tipo_atendimento?: string;
}

export interface ICONSULTA {
  CSI_NOMPAC?: string;
  CSI_CONTROLE?: number;
  CSI_DATAAG?: string | Date;
  DATA_CONSULTA?: string | Date;
  CSI_DATACONF?: string | Date;
  CSI_HORARIO?: string | Date;
  CSI_NOMUSUCONF?: string;
  CSI_STATUS?: string;
  UNIDADE?: string;
  CSI_NOMMED?: string;
  CBO_PROFISSIONAL?: string;
  TIPO_ATENDIMENTO?: string;
}

export enum IConsultaStatus {
  Consultado            = 'Consultado',
  AConsultar            = 'Aguardando Consulta',
  Internado             = 'Internado',
  AInternar             = 'Aguardando Internamento',
  TeveAlta              = 'Alta Curado',
  TeveAltaPedido        = 'Alta a Pedido',
  Encaminhado           = 'Encaminhado',
  Obito                 = 'Óbito',
  TodasPendentes        = 'Todas Pendentes',
  AguardandoConfirmacao = 'Aguardando Confirmação',
  AguardandoExame       = 'Aguardando Exame',
  Cancelada             = 'Cancelada',
  NaoCompareceu         = 'Não Compareceu',
  NaoConfirmou          = 'Não Confirmou',
  HorarioReservado      = 'Horario Reservado',
}

export const consultaSQL = {

  /**
   * @param id_individuos Array com id dos indivíduos
   * @params [first, skip, id_individuos in]
   */
  historico: (id_individuos: number[]): string =>  'SELECT FIRST ? SKIP ? '
  + '  CP.CSI_NOMPAC, '
  + '  C.CSI_CONTROLE, '
  + '  C.CSI_DATAAG, '
  + '  CAST(C.CSI_DATACON AS DATE) AS DATA_CONSULTA, '
  + '  C.CSI_HORARIO, '
  + '  C.CSI_STATUS, '
  + '  UND.CSI_NOMUNI AS UNIDADE, '
  + '  M.CSI_NOMMED, '
  + '  CBO.DESCRICAO AS CBO_PROFISSIONAL, '
  + ' (CASE '
  + "   WHEN UND.FLG_UNIDADE_PA = 'True' THEN 'ATENDIMENTO NO P.A.' "
  + "   ELSE 'CONSULTA AGENDADA' END "
  + ' ) AS TIPO_ATENDIMENTO '
  + 'FROM TSI_CONSULTAS C '
  + 'INNER JOIN TSI_MEDICOS M ON (M.CSI_CODMED = C.CSI_CODMED) '
  + 'INNER JOIN TSI_PONTOS P ON (C.CSI_CODPONTO = P.CSI_CODPONTO) '
  + 'INNER JOIN TSI_CADPAC CP ON (C.CSI_CODPAC = CP.CSI_CODPAC) '
  + 'LEFT OUTER JOIN TSI_CBO CBO ON (CBO.CODIGO = C.CSI_CBO) '
  + 'INNER JOIN TSI_UNIDADE UND ON UND.CSI_CODUNI = P.CSI_CODUNI '
  + "WHERE C.CSI_STATUS NOT IN ('Aguardando Consulta', 'Aguardando Confirmação') "
  + `AND C.CSI_CODPAC IN (${id_individuos.join(', ')}) `
  + ' ORDER BY C.CSI_DATACON, C.CSI_HORARIO DESC;',


  /**
   * @param id_individuos Array com id dos indivíduos
   *
   * @params [first, skip, id_individuos in]
   */
  emAndamento: (id_individuos: number[]): string => 'SELECT FIRST ? SKIP ? '
  + '  CP.CSI_NOMPAC, '
  + '  C.CSI_CONTROLE, '
  + '  C.CSI_DATAAG, '
  + '  CAST(C.CSI_DATACON AS DATE) AS DATA_CONSULTA, '
  + '  C.CSI_HORARIO, '
  + '  (CASE '
  + "    WHEN C.CSI_STATUS = 'Aguardando Consulta' THEN 'Consulta Confirmada' "
  + "    WHEN C.CSI_STATUS = 'Aguardando Confirmação' THEN 'Aguardando Confirmação' "
  + "    ELSE 'EM ANDAMENTO' END "
  + '  ) AS CSI_STATUS,'
  + '  UND.CSI_NOMUNI AS UNIDADE, '
  + '  M.CSI_NOMMED, '
  + '  CBO.DESCRICAO AS CBO_PROFISSIONAL '
  + 'FROM TSI_CONSULTAS C '
  + 'INNER JOIN TSI_MEDICOS M ON (M.CSI_CODMED = C.CSI_CODMED) '
  + 'INNER JOIN TSI_PONTOS P ON (C.CSI_CODPONTO = P.CSI_CODPONTO) '
  + 'INNER JOIN TSI_CADPAC CP ON (C.CSI_CODPAC = CP.CSI_CODPAC) '
  + 'LEFT OUTER JOIN TSI_CBO CBO ON (CBO.CODIGO = C.CSI_CBO) '
  + 'INNER JOIN TSI_UNIDADE UND ON UND.CSI_CODUNI = P.CSI_CODUNI '
  + "WHERE C.CSI_STATUS IN ('Aguardando Consulta', 'Aguardando Confirmação') "
  + " AND UND.FLG_UNIDADE_PA <> 'True' "
  + `AND C.CSI_CODPAC IN (${id_individuos.join(', ')}) `
  + ' ORDER BY C.CSI_DATACON, C.CSI_HORARIO;',
};
