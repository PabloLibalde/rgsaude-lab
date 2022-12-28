/* eslint-disable no-await-in-loop */
import { Request, Response } from 'express';
import { readdir, writeFile } from 'fs';
import { promisify } from 'util';
import HTTP from 'http-status-codes';

import serverConfig from '../../config/serverConfig';
import * as Utils from '../utils';

import InformacaoFeedback from '../models/InformacaoFeedback';
import Foto from '../models/Foto';
import { IInformacaoFeedback } from '../models/interfaces/informacao';
import messages from '../utils/messages';

class InformacaoFeedbackController {
  private ftpAvatar = `${serverConfig.baseUrl}/${serverConfig.path.userAvatar}`

  private dirAvatar = serverConfig.dir.userAvatar;

  constructor() {
    this.index = this.index.bind(this);
    this.store = this.store.bind(this);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { id_informacao } = req.params;

    try {
      const feedbacks = await InformacaoFeedback.findAllByInfo(Number(id_informacao));

      if (feedbacks.length > 0) {
        const filesList = await promisify(readdir)(this.dirAvatar);

        for (const feedback of feedbacks) {
          const fileName = `avatar_${feedback.id_usuario}.jpg`;
          const [fileExists] = filesList.filter((file) => file === fileName);

          if (!fileExists) {
            const foto = await Foto.find(feedback.id_usuario);

            if (foto.id) {
              try {
                const bufferImage: Buffer = await Utils.blobToBuffer(foto.blobFoto);
                await promisify(writeFile)(`${this.dirAvatar}/${fileName}`, bufferImage, { flag: 'w' });

                feedback.avatar_usuario = `${this.ftpAvatar}/${fileName}`;
              } catch (ex) {
                console.error('writeFile -> error', ex);
                feedback.avatar_usuario = null;
              }
            } else {
              feedback.avatar_usuario = null;
            }
          } else {
            feedback.avatar_usuario = `${this.ftpAvatar}/${fileName}`;
          }
        }
      }

      return res.status(HTTP.OK).json({ feedbacks });
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: messages.msg_padrao.erro_buscarRegistro,
      });
    }
  }

  public async store(req: Request, res: Response): Promise<Response> {
    const { id_informacao, texto } = req.body;
    const id_usuario = req.userId;

    try {
      const genId = await InformacaoFeedback.genId();

      await InformacaoFeedback.insert({
        ID: genId || null,
        ID_INFORMACAO: id_informacao,
        ID_USUARIO: id_usuario,
        TEXTO: texto,
        CRIADO_EM: new Date(),
      });

      return res.status(HTTP.OK).json({
        id: genId || null,
        id_informacao,
        id_usuario,
        texto,
        criado_em: new Date(),
        avatar_usuario: `${this.ftpAvatar}/avatar_${id_usuario}.jpg`,
      } as IInformacaoFeedback);
    } catch (ex) {
      return res.status(HTTP.BAD_REQUEST).json({ message: 'Problemas ao tentar gravar feedback.' });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id_feedback } = req.params;

    try {
      await InformacaoFeedback.delete(id_feedback);

      return res.status(HTTP.OK).json({ message: 'Feedback apagado com sucesso!' });
    } catch (ex) {
      return res.status(HTTP.BAD_REQUEST).json({ message: 'Problemas ao tentar apagar feedback.' });
    }
  }
}

export default new InformacaoFeedbackController();
