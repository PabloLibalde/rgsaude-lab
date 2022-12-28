import { Request, Response } from 'express';
import HTTP from 'http-status-codes';
import * as Yup from 'yup';

import InformacaoGostou from '../models/InformacaoGostou';

class InformacaoGostouController {
  public async store(req: Request, res: Response): Promise<Response> {
    const { id_informacao } = req.body;
    const id_usuario = req.userId;

    try {
      const schema = Yup.object().shape({
        id_usuario: Yup.number().required(),
        id_informacao: Yup.number().required(),
      });

      await schema.isValid({ id_usuario, id_informacao });
    } catch (error) {
      return res.status(HTTP.BAD_REQUEST).json({ message: 'Problemas na validação dos dados.' });
    }

    try {
      await InformacaoGostou.insert({
        ID_USUARIO: id_usuario,
        ID_INFORMACAO: id_informacao,
        CRIADO_EM: new Date(),
      });

      return res.status(HTTP.OK).json({ message: 'OK' });
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: 'Erro' });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id_informacao } = req.params;
    const id_usuario = req.userId;

    try {
      const schema = Yup.object().shape({
        id_usuario: Yup.number().required(),
        id_informacao: Yup.number().required(),
      });

      await schema.isValid({ id_usuario, id_informacao });
    } catch (error) {
      return res.status(HTTP.BAD_REQUEST).json({ message: 'Problemas na validação dos dados.' });
    }

    try {
      await InformacaoGostou.delete(id_usuario, Number(id_informacao));

      return res.status(HTTP.OK).json({ message: 'OK' });
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: 'Erro' });
    }
  }
}


export default new InformacaoGostouController();
