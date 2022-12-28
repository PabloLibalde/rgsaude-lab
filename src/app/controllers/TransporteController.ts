import { Request, Response } from 'express';
import HTTP from 'http-status-codes';
import * as Yup from 'yup';

import Transporte from '../models/Transporte';
import UsuarioVinculo from '../models/UsuarioVinculo';

class TransporteController {
  public async emandamento(req: Request, res: Response): Promise<Response> {
    const { page } = req.params;
    const id_usuario = req.userId;

    if (!page) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: 'Informe a página para busca. Ex: 1',
      });
    }

    try {
      const usuarios_vinculados = await UsuarioVinculo.getAllByUsuario(id_usuario);

      const transportes = await Transporte.getAllEmAndamento(Number(page), [
        id_usuario,
        ...usuarios_vinculados.map((uv) => uv.id_usuario_vinculado),
      ]);
      return res.status(HTTP.OK).json([...transportes]);
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: 'Problemas ao buscar registros de transporte',
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

      const transportes = await Transporte.getAllHistorico(Number(page), [
        id_usuario,
        ...usuarios_vinculados.map((uv) => uv.id_usuario_vinculado),
      ]);
      return res.status(HTTP.OK).json([...transportes]);
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: 'Problemas ao buscar registros de transporte',
      });
    }
  }

  public async confirmar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const id_usuario = req.userId;

    try {
      const schema = Yup.object().shape({
        id: Yup.number()
          .required('Transporte não identificado'),
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
      await Transporte.update({ ID_PACIENTE: id_usuario, ID_VIAGEM: Number(id) }, {
        STATUS: 'CO',
      });

      return res.status(HTTP.OK).json({ message: 'Transporte confirmado com sucesso!' });
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: 'Problemas ao tentar confirmar transporte.',
      });
    }
  }

  public async cancelar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const id_usuario = req.userId;

    try {
      const schema = Yup.object().shape({
        id: Yup.number()
          .required('Transporte não identificado'),
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
      await Transporte.update({ ID_PACIENTE: id_usuario, ID_VIAGEM: Number(id) }, {
        STATUS: 'C',
      });

      return res.status(HTTP.OK).json({ message: 'Transporte cancelado com sucesso!' });
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: 'Problemas ao tentar cancelar transporte.',
      });
    }
  }
}

export default new TransporteController();
