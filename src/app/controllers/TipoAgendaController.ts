import { Request, Response } from 'express';
import HTTP from 'http-status-codes';

import TipoAgenda from '../models/TipoAgenda';
import messages from '../utils/messages';

class TipoAgendaController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const registros = await TipoAgenda.getAllTipoAgenda();

      return res.status(HTTP.OK).json(registros);
    } catch (error) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: messages.msg_padrao.erro_buscarRegistro,
      });
    }
  }
}

export default new TipoAgendaController();
