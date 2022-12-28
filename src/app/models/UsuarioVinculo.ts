import BaseManager from '../../database/BaseManager';
import {
  ID_USUARIO_VINCULADO_LISTA, IRG_SAUDE_USUARIO_VINCULO, IUsuarioVinculo,
  IUsuarioVinculoLista, usuarioSQL
} from './interfaces/usuario';

class UsuarioVinculo {
  private table = 'RG_SAUDE_USUARIO_VINCULO';

  public async getAllByUsuarioVinculados(id_usuario: number): Promise<IUsuarioVinculoLista[]> {
    const queryResult: ID_USUARIO_VINCULADO_LISTA[] = await
    BaseManager.searchQuery(usuarioSQL.usuariosVinculados, [id_usuario]);

    if (queryResult) {
      return queryResult.map((qr) => ({
        id_usuario_vinculado: qr.ID_USUARIO_VINCULADO,
        usuario_vinculado: qr.USUARIO_VINCULADO,
      }) as IUsuarioVinculoLista);
    }

    return [] as IUsuarioVinculoLista[];
  }

  public async find(cond: IRG_SAUDE_USUARIO_VINCULO): Promise<boolean> {
    const executed = await BaseManager.search(this.table, cond, null, true);
    return executed || false;
  }

  public async getAllByUsuario(id_usuario: number): Promise<IUsuarioVinculo[]> {
    const queryResult: IRG_SAUDE_USUARIO_VINCULO[] = await BaseManager.search(this.table, {
      ID_USUARIO: id_usuario,
    });

    if (queryResult) {
      return queryResult.map((qr) => ({
        id_usuario: qr.ID_USUARIO,
        id_usuario_vinculado: qr.ID_USUARIO_VINCULADO,
      }) as IUsuarioVinculo);
    }

    return [] as IUsuarioVinculo[];
  }

  public async getAllByVinculo(id_usuario_vinculado: number): Promise<IUsuarioVinculo[]> {
    const queryResult: IRG_SAUDE_USUARIO_VINCULO[] = await BaseManager.search(this.table, {
      ID_USUARIO_VINCULADO: id_usuario_vinculado,
    });

    if (queryResult) {
      return queryResult.map((qr) => ({
        id_usuario: qr.ID_USUARIO,
        id_usuario_vinculado: qr.ID_USUARIO_VINCULADO,
      }) as IUsuarioVinculo);
    }

    return [] as IUsuarioVinculo[];
  }

  public async insert(itens: IRG_SAUDE_USUARIO_VINCULO): Promise<boolean> {
    const executed = await BaseManager.insert(this.table, itens);
    return executed || false;
  }

  public async delete(cond: IRG_SAUDE_USUARIO_VINCULO): Promise<boolean> {
    const executed = await BaseManager.delete(this.table, cond);
    return executed || false;
  }
}

export default new UsuarioVinculo();
