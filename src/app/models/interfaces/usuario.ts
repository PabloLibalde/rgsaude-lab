import { IFoto } from './foto';

export interface IUsuario {
  id: number; // ID
  id_familia?: number; // ID_FAMILIA
  id_esus_caddomiciliar?: number; // ID_ESUS_CADDOMICILIAR
  nome: string; // NOME
  data_nascimento?: string | Date; // DATA_NASCIMENTO
  sexo?: string; // SEXO
  cpf?: string; // CPF
  cns?: string; // CNS
  telefone?: string; // CELULAR
  senha?: string; // SENHA
  email?: string; // EMAIL
  ultimo_acesso?: string | Date; // ULTIMO_ACESSO
  criado_em?: string | Date; // CRIADO_EM
  atualizado_em?: string | Date; // ATUALIZADO_EM
  foto?: IFoto;
}

export interface IUsuarioVinculo {
  id_usuario?: number;
  id_usuario_vinculado?: number;
}

export interface IUsuarioVinculoLista {
  id_usuario_vinculado?: number;
  usuario_vinculado?: string;
}

export interface IRG_SAUDE_USUARIO {
  ID?: number;
  ID_FAMILIA?: number;
  ID_ESUS_CADDOMICILIAR?: number;
  NOME?: string;
  DATA_NASCIMENTO?: string | Date;
  SEXO?: string;
  CPF?: string;
  CNS?: string;
  EMAIL?: string;
  SENHA?: string;
  CELULAR?: string;
  CRIADO_EM?: string | Date;
  ATUALIZADO_EM?: string | Date;
  ULTIMO_ACESSO?: string | Date;
}

export interface IRG_SAUDE_USUARIO_VINCULO {
  ID_USUARIO?: number;
  ID_USUARIO_VINCULADO?: number;
}

export interface ID_USUARIO_VINCULADO_LISTA {
  ID_USUARIO_VINCULADO?: number;
  USUARIO_VINCULADO?: string;
}

export enum usuarioSQL {
  /**
   * @params [cpf]
   */
  verificaUsuarioCPF = "SELECT * FROM RG_SAUDE_USUARIO USU WHERE (USU.CPF IS NOT NULL AND REPLACE(REPLACE(USU.CPF, '-', ''),  '.', '') = ?)",

  /**
   * @params [cns]
   */
  verificaUsuarioCNS = 'SELECT * FROM RG_SAUDE_USUARIO USU WHERE (USU.CNS IS NOT NULL AND USU.CNS = ?)',

  /**
   * @params [id_usuario]
   */
  usuariosVinculados = 'SELECT U.ID AS ID_USUARIO_VINCULADO, P.CSI_NOMPAC AS USUARIO_VINCULADO '
                     + 'FROM RG_SAUDE_USUARIO_VINCULO UV                                       '
                     + 'JOIN RG_SAUDE_USUARIO U ON UV.ID_USUARIO_VINCULADO = U.ID              '
                     + 'JOIN TSI_CADPAC P ON U.ID = P.CSI_CODPAC                               '
                     + 'WHERE UV.ID_USUARIO = ?                                                ',
}
