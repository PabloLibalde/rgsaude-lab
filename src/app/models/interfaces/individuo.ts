import { IFoto } from './foto';

export interface IIndividuo {
  id: number; // CSI_CODPAC
  id_familia?: number; // ID_FAMILIA
  id_esus_caddomiciliar?: number; // ID_ESUS_CADDOMICILIAR
  nome: string; // CSI_NOMPAC
  data_nascimento?: string | Date; // CSI_DTNASC
  sexo?: string; // CSI_SEXPAC
  cpf?: string; // CSI_CPFPAC
  cns?: string; // CSI_NCARTAO
  nome_mae?: string; // CSI_MAEPAC
  telefone?: string; // CSI_CELULAR
  email?: string; // EMIAL
  foto?: IFoto;
  cadastro_app?: boolean;
  vinculado?: boolean;
}

export interface ITSI_CADPAC {
  CSI_NOMPAC?: string;
  CSI_ENDPAC?: string;
  CSI_BAIPAC?: string;
  CSI_CEPPAC?: string;
  CSI_CODCID?: string;
  CSI_CIDRES?: string;
  CSI_CODNAT?: string;
  CSI_CODPRO?: number;
  CSI_REFPAC?: string;
  CSI_RESVIN?: string;
  CSI_FONRES?: string;
  CSI_ENDRES?: string;
  CSI_BAIRES?: string;
  CSI_CEPRES?: string;
  CSI_DTNASC?: string | Date;
  CSI_SEXPAC?: string;
  CSI_IDEPAC?: string;
  CSI_ESTIDE?: string;
  CSI_ORGIDE?: string;
  CSI_EMIDEN?: string | Date;
  CSI_TIPCER?: string;
  CSI_CARCER?: string;
  CSI_LIVCER?: string;
  CSI_FOLIVR?: string;
  CSI_OUTDOC?: string;
  CSI_ESCPAC?: string;
  CSI_PISPAC?: string;
  CSI_CODPAC?: number;
  CSI_CPFPAC?: string;
  CSI_CTRPC?: string;
  CSI_TITELE?: string;
  CSI_DATREG?: string | Date;
  CSI_CORPAC?: string;
  CSI_PAIPAC?: string;
  CSI_MAEPAC?: string;
  CSI_ESTCIV?: string;
  CSI_ZONTIT?: string;
  CSI_SECTIT?: string;
  CSI_NUMCER?: string;
  EXCLUIDO?: string;
  CSI_NOMUSU?: string;
  CSI_DATAINC?: string | Date;
  CSI_DATAALT?: string | Date;
  CSI_DATAEXC?: string | Date;
  CSI_FONRESIDENCIA?: string;
  CSI_FONCONTATO?: string;
  CSI_CELULAR?: string;
  CSI_AGSAUDE?: string;
  CSI_MEDICO?: string;
  CSI_USOCONTROLADO?: string;
  CSI_OBSERVACAO?: string | Blob;
  CSI_NCARTAO?: string;
  CSI_CODAGE?: number,
  CSI_QTDEP?: number,
  CSI_TIPRES?: string;
  CSI_VLRALUGUEL?: number;
  CSI_COMPEC?: string;
  CSI_RENDA?: string;
  CSI_OBSES?: string | Blob;
  CSI_ESTFISRES?: string;
  CSI_EMPREGADO?: string;
  CSI_LOCALEMP?: string;
  CSI_CTPSAS?: string;
  CSI_TRESMUN?: string;
  CSI_QTDEFILHOS?: number;
  CSI_CONDHAB?: string;
  CSI_RENFAM?: string;
  CSI_PARSOCIAL?: string | Blob;
  CSI_ATITELE?: string;
  CSI_ACERCIV?: string;
  CSI_CIDCERC?: number;
  CSI_AIDENT?: string;
  CSI_COMIDE?: string;
  CSI_EXPIDE?: string | Date;
  CSI_ACERRES?: string;
  CSI_NCERRES?: string;
  CSI_PSBF?: string;
  CSI_PSPETI?: string;
  CSI_PSVALOR?: number;
  CSI_SITUACAO?: string;
  CSI_DATAPR?: string | Date;
  CSI_EMICER?: string | Date;
  CSI_CODEND?: number;
  CSI_CODFAM?: string;
  CSI_ACARVAC?: string;
  CSI_ACOMRES?: string;
  CSI_ACARTRA?: string;
  CSI_FOTO?: string;
  CSI_CODFUN?: number;
  CSI_CODGRAU?: number;
  CSI_CARTAO?: number;
  CSI_SANGUEGRUPO?: string;
  CSI_SANGUEFATOR?: string;
  CSI_CODHEMOES?: string;
  CSI_DSANGUE?: string;
  CSI_DSANGUEOBS?: string | Blob;
  CSI_NUMUSERSUS?: string;
  CSI_ULTEMICARTAO?: string | Date;
  CSI_CODPLANO?: number;
  CSI_CRE?: string;
  CSI_NOVA_CERTIDAO?: string;
  CSI_DT_PRIMEIRA_CNH?: string | Date;
  CSI_COD_CADSUS?: string;
  CSI_SITUACAO_FAMILIAR?: string;
  CSI_CERTIDAO_TERMO?: string;
  CSI_CTPS_UF?: string;
  CSI_CTPS_DTEMIS?: string | Date;
  CSI_CTPS_SERIE?: number,
  CSI_ID_NACIONALIDADE?: number;
  CSI_NATURALIDADE_PORTARIA?: string;
  CSI_NATURALIDADE_DATA?: string | Date;
  CSI_AVC?: string;
  CSI_PRE_DIABETICO?: string;
  CSI_STATUS_HIPERDIA?: string;
  CSI_NUMERO_LOGRADOURO?: string;
  CSI_DATA_ENTRADA_PAIS?: string | Date;
  CSI_DATA_OBITO?: string | Date;
  EMIAL?: string;
  ETNIA?: string;
  CSI_ESTUDANDO?: string | boolean;
  CSI_NOMUSUALTER?: string;
  SIT_MERCADO_TRAB?: number;
  RESPONSAVEL_CRIANCA?: number;
  FREQ_CURANDEIRO?: string | boolean;
  GRUPO_COMUNITARIO?: string | boolean;
  COMUNIDADE_TRADIC?: string | boolean;
  DESC_COMUNIDADE?: string;
  VERIFICA_IDENT_SEX?: string | boolean;
  ORIENTACAO_SEXUAL?: number;
  VERIF_SITUACAO_RUA?: string | boolean;
  TEMPO_SITUACAO_RUA?: number;
  OUTRA_INSTITUICAO?: string | boolean;
  DESC_INSTITUICAO?: string;
  VISITA_FAMILIAR?: string | boolean;
  GRAU_PARENTESCO?: string;
  SITUACAO_PESO?: number;
  FUMANTE?: string | boolean;
  ALCOOL?: string | boolean;
  DROGAS?: string | boolean;
  HIPERTENSO?: string | boolean;
  DIABETES?: string | boolean;
  AVC_DERRAME?: string | boolean;
  INFARTO?: string | boolean;
  VERIFICA_CARDIACA?: string | boolean;
  INSULF_CARDIACA?: string | boolean;
  CARDIACA_OUTRO?: string | boolean;
  DOENCA_RESPIRATORIA?: string | boolean;
  RESP_ASMA?: string | boolean;
  RESP_ENFISEMA?: string | boolean;
  RESP_OUTRO?: string | boolean;
  RESP_NSABE?: string | boolean;
  HANSENIASE?: string | boolean;
  TUBERCULOSE?: string | boolean;
  CANCER?: string | boolean;
  INTERNACAO?: string | boolean;
  INTERNACAO_CAUSA?: string;
  TRATAMENTO_PSIQ?: string | boolean;
  ACAMADO?: string | boolean;
  DOMICILIADO?: string | boolean;
  PLANTAS_MEDICINAIS?: string | boolean;
  QUAIS_PLANTAS?: string;
  PRATICAS_COMPLEM?: string | boolean;
  OUTRAS_CONDIC_01?: string;
  OUTRAS_CONDIC_02?: string;
  OUTRAS_CONDIC_03?: string;
  VEZES_ALIMENTA?: number;
  RESTAURANTE_POPU?: string | boolean;
  DOAC_GRUP_RELIG?: string | boolean;
  DOAC_RESTAURANTE?: string | boolean;
  DOACAO_POPULAR?: string | boolean;
  DOACAO_OUTROS?: string | boolean;
  ACESSO_HIGIENTEP?: string | boolean;
  BANHO?: string | boolean;
  ACESSO_SANIT?: string | boolean;
  HIGIENE_BUCAL?: string | boolean;
  HIGIENE_OUTROS?: string | boolean;
  CARDIACA_NSABE?: string | boolean;
  SIT_RUA_BENEFICIO?: string | boolean;
  SIT_RUA_FAMILIAR?: string | boolean;
  VERIFICA_DEFICIENCIA?: number;
  DEF_AUDITIVA?: string | boolean;
  DEF_VISUAL?: string | boolean;
  DEF_INTELECTUAL?: string | boolean;
  DEF_FISICA?: string | boolean;
  DEF_OUTRA?: string | boolean;
  VERIFICA_RINS?: number;
  RINS_INSULFICIENCIA?: string | boolean;
  RINS_OUTROS?: string | boolean;
  RINS_NSABE?: string | boolean;
  ID_ESUS_CADDOMICILIAR?: number;
  NACIONALIDADE?: number;
  ESUS_UUID?: string;
  NOME_SOCIAL?: string;
  DATA_ALTERACAO_SERV?: string | Date;
  UUID_REGISTRO_MOBILE?: string;
  POSSUI_PLANO_SAUDE?: string | boolean;
  ID_ESUS_EXPORTACAO_ITEM?: number;
  COD_AGEESUS?: number,
  ID_MOTIVO_SAIDA?: number;
  DATA_ATUALIZACAO_CNS?: string | Date;
  NUM_PROCESSO_ESTADO?: string;
  NUMERO_DNV?: number;
  FLG_PERMITIR_SMS?: string | boolean;
  FLG_NATURALIZADO?: string | boolean;
  DATA_RETORNO?: string | Date;
  ESUS_RESPONSAVEL_DOMICILIO?: string;
  ESUS_CNS_RESPONSAVEL_DOMICILIO?: string;
  ESUS_VERIFICA_IDENT_GENERO?: string;
  ESUS_IDENT_GENERO?: number,
  ESUS_CRIANCA_ADULTO?: string;
  ESUS_CRIANCA_OUTRA_CRIANCA?: string;
  ESUS_CRIANCA_ADOLESCENTE?: string;
  ESUS_CRIANCA_SOZINHA?: string;
  ESUS_CRIANCA_CRECHE?: string;
  ESUS_CRIANCA_OUTRO?: string;
  ESUS_SAIDA_CIDADAO_CADASTRO?: number,
  ESUS_NUMERO_DO?: string;
  ESUS_DIAGNOSTICO_PROB_MENTAL?: string;
  CSI_ECRA?: number,
  CSI_CODAMA?: number,
  UUID_ALTERACAO?: string;
  FLG_EXPORTAR_ESUS?: string;
  SENHA_MOBILE?: string;
  ID_GESTACAOITEM?: number;
  CSI_PESO?: number;
  CSI_ALTURA?: number;
  ID_FAMILIA?: number,
  ID_ESTABELECIMENTO_SAUDE?: number;

  // Outros campos
  VINCULADO?: number | boolean;
}

export enum individuoSQL {
  /**
   * @params [cpf]
   */
  verificaIndividuoCPF = "SELECT * FROM TSI_CADPAC CP WHERE (CP.CSI_CPFPAC IS NOT NULL AND REPLACE(REPLACE(CP.CSI_CPFPAC, '-', ''),  '.', '') = ?)",

  /**
   * @params [cns]
   */
  verificaIndividuoCNS = 'SELECT * FROM TSI_CADPAC CP WHERE (CP.CSI_NCARTAO IS NOT NULL AND CP.CSI_NCARTAO = ?)',
}
