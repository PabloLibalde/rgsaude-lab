import { Request, Response } from 'express';
import HTTP from 'http-status-codes';

import UsuarioVinculo from '../models/UsuarioVinculo';
import messages from '../utils/messages';

class UsuarioVinculoController {
  public async index(req: Request, res: Response): Promise<Response> {
    const id_usuario = req.userId;

    try {
      const usuariosVinculados = await UsuarioVinculo.getAllByUsuarioVinculados(Number(id_usuario));

      return res.status(HTTP.OK).json(usuariosVinculados);
    } catch (error) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: messages.msg_padrao.erro_buscarRegistro,
      });
    }
  }

  public async store(req: Request, res: Response): Promise<Response> {
    const { id_usuario_vinculado } = req.body;
    const id_usuario = req.userId;

    try {
      await UsuarioVinculo.insert({
        ID_USUARIO: id_usuario,
        ID_USUARIO_VINCULADO: id_usuario_vinculado,
      });

      return res.status(HTTP.OK).json({ message: 'Usuário vinculado com sucesso!' });
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: 'Problemas vincular usuário.',
      });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id: id_usuario_vinculado } = req.params;
    const id_usuario = req.userId;

    try {
      await UsuarioVinculo.delete({
        ID_USUARIO: id_usuario,
        ID_USUARIO_VINCULADO: Number(id_usuario_vinculado),
      });

      return res.status(HTTP.OK).json({ message: 'Vínculo removido com sucesso!' });
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: 'Problemas ao remover vínculo.',
      });
    }
  }
}

export default new UsuarioVinculoController();
