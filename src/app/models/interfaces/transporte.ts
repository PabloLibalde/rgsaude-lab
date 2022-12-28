export interface ITransporte {
  id?: number;
  individuo?: string;
  data_agendamento?: string | Date;
  data_hora?: string | Date;
  veiculo?: string;
  qtde_passageiros?: number;
  destino?: string;
  ponto_partida?: string;
  tipo?: string;
  status?: string;
}

export interface ITRANSPORTE {
  ID?: number;
  CSI_NOMPAC?: string;
  DATA_AGENDAMENTO?: string | Date;
  DATA_HORA?: string | Date;
  VEICULO?: string;
  QTDE_PASSAGEIROS?: number;
  NOME_DESTINO?: string;
  NOME_PARTIDA?: string;
  TIPO?: string;
  STATUS?: string;
  ID_PACIENTE?: number;
  ID_VIAGEM?: number;
}

export const transporteSQL = {

  /**
   * @params [first, skip, id_usuario]
   */
  historico: (id_individuos: number[]): string => 'SELECT FIRST ? SKIP ? '
  + '  VIA.ID, '
  + '  PAC.CSI_NOMPAC, '
  + '  TPV.DATA_AGENDAMENTO, '
  + '  VIA.DATA_HORA, '
  + "  VEI.DESCRICAO||' - '||VEI.PLACA VEICULO, "
  + '  VEI.QTDE_PASSAGEIROS, '
  + '  DESTINO.NOME NOME_DESTINO, '
  + '  PARTIDA.NOME NOME_PARTIDA, '
  + '  TRIM(CASE TPV.TIPO '
  + "    WHEN 'I' THEN 'Ida' "
  + "    WHEN 'V' THEN 'Volta' "
  + "    WHEN 'IV' THEN 'Ida e volta' "
  + '  END) TIPO, '
  + '  TRIM(CASE TPV.STATUS '
  + "    WHEN 'AC' THEN 'Aguardando Confirmação' "
  + "    WHEN 'CO' THEN 'Confirmado' "
  + "    WHEN 'NC' THEN 'Não Compareceu' "
  + "    WHEN 'VI' THEN 'Viajou' "
  + '  END) STATUS '
  + 'FROM TRANSPORTE_VIAGEM VIA   '
  + 'INNER JOIN TRANSPORTE_VEICULO VEI ON (VEI.ID = VIA.ID_VEICULO)   '
  + 'INNER JOIN TRANSPORTE_PONTOS_EMB_DESEMB DESTINO ON (DESTINO.ID = VIA.ID_DESTINO) '
  + 'LEFT JOIN TRANSPORTE_PONTOS_EMB_DESEMB PARTIDA ON (PARTIDA.ID = VIA.ID_PONTO_PARTIDA) '
  + 'INNER JOIN TRANSPORTE_PESSOA_VIAGEM TPV ON (TPV.ID_VIAGEM = VIA.ID)   '
  + 'INNER JOIN TSI_CADPAC PAC ON (PAC.CSI_CODPAC = TPV.ID_PACIENTE)   '
  + `WHERE PAC.CSI_CODPAC IN(${id_individuos.join(', ')}) `
  + "AND TPV.STATUS IN ('NC', 'VI');",

  /**
   * @params [first, skip, id_individuos in]
   */
  emAndamento: (id_individuos: number[]): string => 'SELECT FIRST ? SKIP ? '
  + '  VIA.ID, '
  + '  PAC.CSI_NOMPAC, '
  + '  TPV.DATA_AGENDAMENTO, '
  + '  VIA.DATA_HORA, '
  + "  VEI.DESCRICAO||' - '||VEI.PLACA VEICULO, "
  + '  VEI.QTDE_PASSAGEIROS, '
  + '  DESTINO.NOME NOME_DESTINO, '
  + '  PARTIDA.NOME NOME_PARTIDA, '
  + '  TRIM(CASE TPV.TIPO '
  + "    WHEN 'I' THEN 'Ida' "
  + "    WHEN 'V' THEN 'Volta' "
  + "    WHEN 'IV' THEN 'Ida e volta' "
  + '  END) TIPO, '
  + '  TRIM(CASE TPV.STATUS '
  + "    WHEN 'AC' THEN 'Aguardando Confirmação' "
  + "    WHEN 'CO' THEN 'Confirmado' "
  + "    WHEN 'NC' THEN 'Não Compareceu' "
  + "    WHEN 'VI' THEN 'Viajou' "
  + '  END) STATUS '
  + 'FROM TRANSPORTE_VIAGEM VIA   '
  + 'INNER JOIN TRANSPORTE_VEICULO VEI ON (VEI.ID = VIA.ID_VEICULO)   '
  + 'INNER JOIN TRANSPORTE_PONTOS_EMB_DESEMB DESTINO ON (DESTINO.ID = VIA.ID_DESTINO) '
  + 'INNER JOIN TRANSPORTE_PESSOA_VIAGEM TPV ON (TPV.ID_VIAGEM = VIA.ID)   '
  + 'LEFT JOIN TRANSPORTE_PONTOS_EMB_DESEMB PARTIDA ON (PARTIDA.ID = TPV.ID_PONTO_EMB_IDA) '
  + 'INNER JOIN TSI_CADPAC PAC ON (PAC.CSI_CODPAC = TPV.ID_PACIENTE)   '
  + `WHERE PAC.CSI_CODPAC IN (${id_individuos.join(', ')}) `
  + "AND TPV.STATUS IN ('AC', 'CO');",
};
