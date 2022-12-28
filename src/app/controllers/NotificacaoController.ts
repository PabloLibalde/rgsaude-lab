import { Request, Response } from 'express';
import HTTP from 'http-status-codes';

import {
  sendForAllUsers,
  sendForUsersByTag,
  sendForUsersByPlayerId,
} from '../services/PushNotiticationService';


class NotificacaoController {
  public async notificationAll(req: Request, res: Response): Promise<Response> {
    const { title, message } = req.body;

    const response = await sendForAllUsers(title, message);

    if (response) {
      return res.status(HTTP.OK).json(response);
    }
    return res.status(HTTP.BAD_REQUEST).json(response);
  }

  public async notificationByTag(req: Request, res: Response): Promise<Response> {
    const { tag, title, message } = req.body;

    const response = await sendForUsersByTag(title, message, { [tag.name]: tag.value });

    if (response) {
      return res.status(HTTP.OK).json(response);
    }
    return res.status(HTTP.BAD_REQUEST).json(response);
  }

  public async notificationByDevice(req: Request, res: Response): Promise<Response> {
    const { dispositivo, titulo, mensagem } = req.body;

    const response = await sendForUsersByPlayerId(titulo, mensagem, [dispositivo]);

    if (response) {
      return res.status(HTTP.OK).json(response);
    }
    return res.status(HTTP.BAD_REQUEST).json(response);
  }
}

export default new NotificacaoController();
