export interface IMedicamentoItem {
  id?: number;
  quantidade?: number;
  periodo_uso?: number;
  modo_uso?: string;
  medicamento?: string;
}

export interface IMedicamento {
  id?: number;
  individuo?: string;
  data?: string | Date;
  medico?: string;
  medico_especialidade?: string;
  usuario?: string;
  medicamentos: IMedicamentoItem[];
}

export interface IITEM_MEDICAMENTO {
  CSI_CODIGO?: number;
  CSI_QTDE?: number;
  CSI_PERIODO_USO?: number;
  CSI_MODOUSAR?: Function;
  CSI_NOMMED?: string;
}

export interface ISAIDA_MEDICAMENTO {
  CSI_NOMPAC?: string;
  CSI_CODSAIDA?: number;
  CSI_DATA?: string | Date;
  CSI_MEDICO?: string;
  CSI_DESESP?: string;
  NOME?: string;
}


export const medicamentoSQL = {

  /**
   * @params [first, skip, id_usuario =]
   */
  historicoSaida: (id_individuos: number[]): string => 'SELECT FIRST ? SKIP ? '
  + '  CP.CSI_NOMPAC, '
  + '  S.CSI_CODSAIDA, '
  + '  S.CSI_DATA, '
  + '  ME.CSI_NOMMED CSI_MEDICO, '
  + '  TRIM(E.CSI_DESESP) CSI_DESESP, '
  + '  SU.NOME '
  + 'FROM TSI_SAIDAMED S '
  + 'LEFT JOIN TSI_MEDICOS ME ON (ME.CSI_CODMED = S.CSI_CODMED) '
  + 'LEFT JOIN TSI_CADPAC CP ON (S.CSI_CODPAC = CP.CSI_CODPAC) '
  + 'LEFT OUTER JOIN TSI_ESPECI E ON (E.CSI_CODESP = ME.CSI_CODESP) '
  + 'LEFT JOIN SEG_USUARIO SU ON (SU.ID = S.CSI_ID_USUARIO)  '
  + `WHERE S.CSI_CODPAC IN (${id_individuos.join(', ')}) `
  + 'ORDER BY S.CSI_DATA DESC;',

  /**
   * @params [codigo_saida =]
   */
  medicamentosSaida: 'SELECT'
  + '  I.CSI_CODIGO, '
  + '  I.CSI_QTDE, '
  + '  I.CSI_PERIODO_USO, '
  + '  I.CSI_MODOUSAR, '
  + '  M.CSI_NOMMED '
  + 'FROM TSI_ISAIDAMED I '
  + 'INNER JOIN TSI_MEDICAMENTOS M ON (I.CSI_CODIGO = M.CSI_CODIGO) '
  + 'WHERE I.CSI_CODSAIDA = ?',
};
