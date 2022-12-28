export interface IFoto {
  id?: number; // CSI_ID
  id_usuario: number; // CSI_MATRICULA
  tipo_usuario?: string; // CSI_TIPO - Cidadao = 'C'; Funcionario = 'F'; Medico = 'M';
  blobFoto?: Function; // CSI_FOTO -> Firebird retorna uma função
  url_foto?: string; // Montar string com Url da foto para download
  data_alteracao?: Date // DATA_ALTERACAO
}

export enum fotoSQL {

  updateBlob = 'UPDATE TSI_FOTOS SET CSI_FOTO = ? WHERE CSI_MATRICULA = ?',

  insertBlob = 'INSERT INTO TSI_FOTOS(CSI_MATRICULA, CSI_TIPO, CSI_FOTO) VALUES(?, ? ,?)'
}
