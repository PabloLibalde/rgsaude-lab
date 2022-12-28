import { Request, Response } from 'express';
import HTTP from 'http-status-codes';
import * as Yup from 'yup';

import Consulta from '../models/Consulta';
import UsuarioVinculo from '../models/UsuarioVinculo';
import messages from '../utils/messages';

class ConsultaController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { page } = req.params;
    const id_usuario = req.userId;

    if (!page) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: 'Informe a página para busca. Ex: 1',
      });
    }

    try {
      const usuarios_vinculados = await UsuarioVinculo.getAllByUsuario(id_usuario);

      const consultas = await Consulta.getAllAndamento(Number(page), [
        id_usuario,
        ...usuarios_vinculados.map((uv) => uv.id_usuario_vinculado),
      ]);

      return res.status(HTTP.OK).json([...consultas]);
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: messages.msg_padrao.erro_buscarRegistro,
      });
    }
  }

  public async historico(req: Request, res: Response): Promise<Response> {
    const { page } = req.params;
    const id_usuario = req.userId;

    if (!page) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: 'Informe a página para busca. Ex: 1',
      });
    }

    try {
      const usuarios_vinculados = await UsuarioVinculo.getAllByUsuario(id_usuario);

      const consultas = await Consulta.getAllHistorico(Number(page), [
        id_usuario,
        ...usuarios_vinculados.map((uv) => uv.id_usuario_vinculado),
      ]);

      return res.status(HTTP.OK).json([...consultas]);
    } catch (error) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: messages.msg_padrao.erro_buscarRegistro,
      });
    }
  }

  public async confirmar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const id_usuario = req.userId;

    try {
      const schema = Yup.object().shape({
        id: Yup.number()
          .required('Consulta não identificada'),
        id_usuario: Yup.number()
          .required('Usuário não informado'),
      });

      await schema.validate({ id_usuario, id }, {
        abortEarly: false,
      });
    } catch (ex) {
      if (ex instanceof Yup.ValidationError) {
        return res.status(HTTP.BAD_REQUEST).json({
          message: ex.errors.map((err) => err).join(' | '),
        });
      }
      return res.status(HTTP.BAD_REQUEST).json({ message: ex.message });
    }

    try {
      await Consulta.update(Number(id), {
        CSI_STATUS: 'Aguardando Consulta',
        CSI_DATACONF: new Date(),
        CSI_NOMUSUCONF: 'Suporte (App)',
      });

      return res.status(HTTP.OK).json({
        message: 'Consulta confirmada com sucesso!',
      });
    } catch (ex) {
      console.error(ex.message);
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: `Problemas ao tentar confirmar consulta. ${ex.message}`,
      });
    }
  }

  public async cancelar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const id_usuario = req.userId;

    try {
      const schema = Yup.object().shape({
        id: Yup.number()
          .required('Consulta não identificada'),
        id_usuario: Yup.number()
          .required('Usuário não informado'),
      });

      await schema.validate({ id_usuario, id }, {
        abortEarly: false,
      });
    } catch (ex) {
      if (ex instanceof Yup.ValidationError) {
        return res.status(HTTP.BAD_REQUEST).json({
          message: ex.errors.map((err) => err).join(' | '),
        });
      }
      return res.status(HTTP.BAD_REQUEST).json({ message: ex.message });
    }

    try {
      await Consulta.update(Number(id), {
        CSI_STATUS: 'Cancelada',
        CSI_DATACONF: new Date(),
        CSI_NOMUSUCONF: 'Suporte (App)',
      });

      return res.status(HTTP.OK).json({ message: 'Consulta cancelada com sucesso!' });
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: 'Problemas ao tentar cancelar consulta.',
      });
    }
  }
}

export default new ConsultaController();
