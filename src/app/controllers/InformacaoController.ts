/* eslint-disable no-await-in-loop */
import { Request, Response } from 'express';
import { writeFile, readFile, readdir } from 'fs';
import { promisify } from 'util';
import HTTP from 'http-status-codes';
import * as Yup from 'yup';

import serverConfig from '../../config/serverConfig';
import { blobToBuffer } from '../utils';

import Informacao from '../models/Informacao';
import InformacaoFeedback from '../models/InformacaoFeedback';

import { IRG_SAUDE_INFORMACAO } from '../models/interfaces/informacao';
import messages from '../utils/messages';


class InformacaoController {
  private ftpImages = `${serverConfig.baseUrl}/${serverConfig.path.information}`

  private dirImages = serverConfig.dir.information;

  constructor() {
    this.index = this.index.bind(this);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { page }: { page?: number } = req.params;

    try {
      const infos = await Informacao.getAll(page, req.userId);

      if (infos.length > 0) {
        // Listando imagens de informações na pasta do servidor
        const filesList = await promisify(readdir)(this.dirImages);

        for (const info of infos) {
          const fileName = `informacao_${info.id}.jpg`;
          const [imageExists] = filesList.filter((file) => file === fileName);

          info.ultimo_feedback = await InformacaoFeedback.findOneByInfo(info.id);

          if (!imageExists) { // Gerando imagem
            if (info.blobImagem) {
              const bufferImage: Buffer = await blobToBuffer(info.blobImagem);

              await promisify(writeFile)(`${this.dirImages}/${fileName}`, bufferImage, { flag: 'w' });

              info.imagem_url = `${this.ftpImages}/${fileName}`;
            }
          } else {
            info.imagem_url = `${this.ftpImages}/${fileName}`;
          }

          delete info.blobImagem;
        }
      }

      return res.json([...infos]);
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: messages.msg_padrao.erro_buscarRegistro,
      });
    }
  }

  public async store(req: Request, res: Response): Promise<Response> {
    const itens: IRG_SAUDE_INFORMACAO = req.body;
    const { file } = req;

    // Validando formulário
    try {
      const schema = Yup.object().shape({
        [itens.TITULO]: Yup.string()
          .required()
          .max(100),
      });

      await schema.isValid(itens);
    } catch (ex) {
      return res.status(HTTP.BAD_REQUEST).json({ message: JSON.stringify(ex) });
    }

    if (file) {
      itens.IMAGEM = await promisify(readFile)(file.path);
    }

    try {
      await Informacao.insert(itens);

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
    const { id } = req.body;

    return res.status(HTTP.OK).json({ message: 'OK', id });
  }
}

export default new InformacaoController();
