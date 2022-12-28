import { Request, Response } from 'express';
import HTTP from 'http-status-codes';
import { readFile, unlink } from 'fs';
import { promisify } from 'util';

import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import { emptyObject } from '../utils';
import serverConfig from '../../config/serverConfig';

import Foto from '../models/Foto';

class FotoController {
  private dirAvatar = serverConfig.dir.userAvatar;

  constructor() {
    this.update = this.update.bind(this);
  }

  public async store(req: Request, res: Response): Promise<Response> {
    const { file } = req;

    console.log('userId', req.userId);

    if (!req.userId) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: 'Usuário não informado.',
      });
    }

    if (!file) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: 'Nenhum arquivo recebido',
      });
    }

    try {
      await Foto.insert({
        CSI_MATRICULA: req.userId,
        CSI_TIPO: 'C',
        CSI_FOTO: await promisify(readFile)(file.path),
        DATA_ALTERACAO: format(new Date(), 'dd.MM.yyyy HH:mm:ss', { locale: pt }),
      });

      return res.status(HTTP.OK).json({
        message: 'Dados inseridos com sucesso!',
      });
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: 'Problemas ao tentar inserir dados.',
      });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { idusuario } = req.params;
    const itens = req.body;
    const { file } = req;

    if (emptyObject(itens)) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: 'Nenhum dado para atualizar informado.',
      });
    }

    if (!file) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: 'Nenhum arquivo recebido',
      });
    }

    try {
      await Foto.update(Number(idusuario), {
        CSI_FOTO: await promisify(readFile)(file.path),
        DATA_ALTERACAO: format(new Date(), 'dd.MM.yyyy HH:mm:ss', { locale: pt }),
      });

      const path = `${this.dirAvatar}/avatar_${idusuario}.jpg`;

      await promisify(unlink)(path);

      return res.status(HTTP.OK).json({
        message: 'Dados atualizados com sucesso!',
      });
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: `Problemas ao tentar atualizar dados.${ex.message}`,
      });
    }
  }
}

export default new FotoController();
