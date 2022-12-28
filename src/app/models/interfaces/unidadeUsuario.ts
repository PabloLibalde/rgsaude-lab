import BaseManager from '../../../database/BaseManager';
import { databases } from '../../../config/databaseConfig';

const newStructure = (): boolean => {
  const ibge = BaseManager.getIBGE();
  const [{ novaEstrutura }] = databases.filter((d) => d.ibge === ibge);
  return novaEstrutura;
};

export interface ITSI_UNIDADE {
  CSI_CODUNI?: number;
  CSI_NOMUNI?: string;
  CSI_NOMEST?: string;
  CSI_PREFEITURA?: string;
  CSI_ENDUNI?: string;
  CSI_BAIUNI?: string;
  CSI_CEPUNI?: string;
  CSI_CIDUNI?: string;
  CSI_CNPJ?: string;
  CSI_FONE?: string;
  CSI_FAX?: string;
  CSI_NOMUSU?: string;
  CSI_DATAINC?: Date | string;
  CSI_DATAALT?: Date | string;
  EXCLUIDO?: string;
  CSI_OBSCMED?: string;
  CSI_QTDEM?: number;
  CSI_QTDED?: number;
  CSI_MENSAGEMO?: string;
  CSI_MENSAGEMM?: string;
  CSI_NMAQUINAS?: string;
  CSI_SENHA?: string;
  CSI_LOGO?: string;
  CSI_OBSSAIMED?: string;
  CSI_OBSLAB?: string;
  CSI_COTAMED?: number;
  CSI_OBSLIBMED?: string;
  CSI_ASOCIAL?: string;
  CSI_CRESS?: string;
  CSI_OBSLIBEXAME?: string;
  CSI_CODUPS?: string;
  CSI_CABECALHOP?: string;
  CSI_CABECALHOR?: string;
  CSI_QTDATELABDIA?: number;
  CSI_DATINIAGEXAME?: Date | string;
  CSI_CNES?: string;
  CSI_IDAREA?: number;
  CSI_COTAEXAMESLABMUN?: string;
  CSI_COTAEXAMESTERC?: string;
  CSI_CODZONARESID?: number;
  CSI_IDMODELOSIAB?: number;
  CSI_AVISAR_CIDADAO_OUTRA_AREA?: string;
  CSI_PRAZO_MAX_AGE_REV?: number;
  CSI_CONSULTAS_EX_PERMITIDAS?: number;
  CSI_TEMPO_REC_PED_MEDICAMENTO?: number;
  CSI_DATA_FIM_AGE_EXAME?: Date | string;
  CSI_ID_SECRETARIA?: number;
  CSI_ATEND_SEGUNDA?: string;
  CSI_ATEND_TERCA?: string;
  CSI_ATEND_QUARTA?: string;
  CSI_ATEND_QUINTA?: string;
  CSI_ATEND_SEXTA?: string;
  CSI_ATEND_SABADO?: string;
  CSI_ATEND_DOMINGO?: string;
  CSI_SALDO_CONSORCIO?: number;
  CSI_INICIO_LIB_CONSORCIO?: Date | string;
  CSI_FIM_LIB_CONSORCIO?: Date | string;
  CSI_LIMITE_ATENDIMENTO?: number;
  PNI_SERVIDOR?: string;
  PNI_PORTA?: number;
  PNI_INSTANCIA?: number;
  PNI_ID_SISTEMA?: number;
  PNI_USUARIO?: string;
  PNI_SENHA?: string;
  CSI_LIMITE_FILA_ESPERA?: number;
  CSI_PRAZO_DISP_MEDICAMENTO?: number;
  CSI_PERIODO_USO_MEDICAMENTO?: string;
  FARMACIA_DISPENSACAO_ATEND?: string;
  DATA_ALTERACAO_SERV?: Date | string;
  USAR_PROCESSO_LAB_COMPLETO?: string;
  LAB_CAMPOBUSCAPESQUISA?: string;
  FLG_UNIDADE_PA?: string;
  LOGO_UNIDADE?: string;
  ID_TIPO_SINC_MOBILE?: string;
  VALOR_SINC_MOBILE?: string;
  MARCA_DAGUA?: string;
  CSI_COTAPROCEDIMENTOTERC?: string;
  FLG_REQ_PRESTADOR_PA?: string;
  FLG_REQ_EXAME_PA?: string;
  PROCEDIMENTOS_TMT20?: string;
  FLG_TRIAR_SENHA_PEDIATRIA?: string;
  FLG_UTILIZAR_CONTROLE_SENHA?: string;
  CODIGO_INTERNO_ARQUIVO_CNES?: string;
  IMPRESSORA_SENHA?: number;
  FLG_CONTROLAR_ESTOQUE_PA?: string;
  CABECALHO_LABORATORIO_HOR?: string;
  LAB_UTILIZACOLETA?: string;
  LAB_UTILIZATRIAGEM?: string;
  LAB_UTILIZAVALIDACAO?: string;
  LAB_UTILIZAPROCESSONOVO?: string;
  LAB_ID_BIO1?: number;
  LAB_ID_BIO2?: number;
  LAB_ID_BIO3?: number;
  QTDESINAISVITAISOBRIGATORIO?: number;
  FARM_VALIDAR_GRUPODISPENSACAO?: string;
  CABECALHO_VIGILANCIA?: string;
  RODAPE_LABORATORIO?: string;
  DATA_ALT_IMAGENS?: Date | string;
  MARGEM_SEG_EST_MIN_MEDICAMENTO?: number;
  TIPO_ESTABELECIMENTO?: string;
  ID_CONVENIO_PADRAO?: number;
  EMAIL?: string;
}

export interface IUnidade {
  id?: number;
  nome_unidade?: string;
}

export const unidadeUsuarioSQL = {
  unidadeUsuario: (id_usuario: number): string => 'SELECT '
    + '  UN.*, P.CSI_NOMPAC, P.ID_ESUS_CADDOMICILIAR '
    + 'FROM TSI_CADPAC P '

    + `${newStructure()
      ? 'JOIN ESUS_FAMILIA FAM ON P.ID_FAMILIA = FAM.ID '
          + 'JOIN VS_ESTABELECIMENTOS EST ON FAM.ID_DOMICILIO = EST.ID '
          + 'JOIN ESUS_MICROAREA M ON EST.ID_MICROAREA = M.ID '

      : 'JOIN ESUS_CADDOMICILIAR CAD ON P.ID_ESUS_CADDOMICILIAR = CAD.ID '
        + 'JOIN ESUS_MICROAREA M ON CAD.ID_MICROAREA = M.ID '
    }`
    + 'JOIN ESUS_EQUIPES E ON M.ID_EQUIPE = E.ID '
    + 'JOIN ESUS_ESTABELECIMENTO_SAUDE ES ON E.ID_ESTABELECIMENTO = ES.ID '
    + 'JOIN TSI_UNIDADE UN ON ES.CNES = UN.CSI_CNES '
    + `WHERE P.CSI_CODPAC = ${id_usuario}; `,
};
