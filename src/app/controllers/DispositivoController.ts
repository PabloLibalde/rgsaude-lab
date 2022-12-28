import { Request, Response } from 'express';
import HTTP from 'http-status-codes';
import * as Yup from 'yup';

import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Dispositivo from '../models/Dispositivo';


class DispositivoController {
  public async updateOrStore(req: Request, res: Response): Promise<Response> {
    const { id_usuario, id_dispositivo } = req.body;

    try {
      const schema = Yup.object().shape({
        id_usuario: Yup.number()
          .required(),
        id_dispositivo: Yup.string()
          .required()
          .length(36),
      });

      await schema.validate({ id_usuario, id_dispositivo }, {
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
      await Dispositivo.updateOrInsert({
        ID_DISPOSITIVO: id_dispositivo,
        ID_INDIVIDUO: id_usuario,
        ULTIMO_ACESSO: format(new Date(), 'dd.MM.yyyy HH:mm:ss', { locale: pt }),
      }, [
        'ID_DISPOSITIVO',
        'ID_INDIVIDUO',
      ]);

      return res.status(HTTP.OK).json({
        message: 'Dispositivo cadastrado/atualizado com sucesso!',
      });
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: 'Problemas ao cadastrar/atualizar dispositivo.',
      });
    }
  }
}

export default new DispositivoController();
