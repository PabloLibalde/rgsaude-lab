import { Request, Response } from 'express';
import { writeFile } from 'fs';
import HTTP from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import * as Yup from 'yup';

import serverConfig from '../../config/serverConfig';
import authConfig from '../../config/auth';

import Usuario from '../models/Usuario';
import Foto from '../models/Foto';

import { blobToBuffer } from '../utils';
import messages from '../utils/messages';

class SessaoController {
  private ftpAvatar = `${serverConfig.baseUrl}/${serverConfig.path.userAvatar}`;

  private dirAvatar = serverConfig.dir.userAvatar;

  constructor() {
    this.store = this.store.bind(this);
  }

  public async store(req: Request, res: Response): Promise<Response> {
    const { login, password } = req.body;

    try {
      const schema = Yup.object().shape({
        login: Yup.string()
          .required()
          .min(11)
          .max(15),
        password: Yup.string()
          .required()
          .min(6),
      });

      await schema.validate({ login, password }, {
        abortEarly: false,
      });
    } catch (ex) {
      if (ex instanceof Yup.ValidationError) {
        return res.status(HTTP.BAD_REQUEST).json({ message: ex.errors.map((err) => err).join(' | ') });
      }
      return res.status(HTTP.BAD_REQUEST).json({ message: `Usuário ou senha inválido(s)${ex.message}` });
    }

    try {
      const searchFor = (login.length === 11) ? 'cpf' : 'cns';

      const user = await Usuario.verificaUsuario(login, searchFor);

      if (!user.id) {
        return res.status(HTTP.UNAUTHORIZED).json({ message: 'Usuário não encontrado.' });
      }

      if (!Usuario.checkPassword(user.senha, password)) {
        return res.status(HTTP.UNAUTHORIZED).json({ message: 'Senha incorreta.' });
      }

      // Buscando avatar do usuário
      user.foto = await Foto.find(user.id);

      // Gravando avatar na pasta do servidor
      if (user.foto.id) {
        const fileName = `avatar_${user.id}.jpg`;

        const bufferImage: Buffer = await blobToBuffer(user.foto.blobFoto);
        await promisify(writeFile)(`${this.dirAvatar}/${fileName}`, bufferImage, { flag: 'a' });

        // Definindo Url do avatar
        user.foto.url_foto = `${this.ftpAvatar}/${fileName}`;
      }

      delete user.foto.blobFoto;

      const {
        id,
        id_familia,
        id_esus_caddomiciliar,
        nome,
        email,
        data_nascimento,
        cpf,
        cns,
        celular,
        sexo,
        foto,
        ultimo_acesso,
      } = user;

      return res.status(HTTP.OK).json({
        user: {
          id,
          id_familia,
          id_esus_caddomiciliar,
          nome,
          email,
          data_nascimento,
          cpf,
          cns,
          celular,
          sexo,
          ultimo_acesso,
          foto,
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: messages.msg_padrao.erro_login,
      });
    }
  }
}

export default new SessaoController();
