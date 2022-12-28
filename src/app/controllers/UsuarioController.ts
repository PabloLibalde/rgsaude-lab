import { Request, Response } from 'express';
import HTTP from 'http-status-codes';
import { writeFile } from 'fs';
import { promisify } from 'util';
import md5 from 'md5';
import * as Yup from 'yup';

import serverConfig from '../../config/serverConfig';
import {
  blobToBuffer, emptyObject, extractNumbersFromString, generatePassword,
} from '../utils';

import Usuario from '../models/Usuario';
import Foto from '../models/Foto';
import { IRG_SAUDE_USUARIO } from '../models/interfaces/usuario';
import { sendForSingleUser } from '../services/SMSService';
import messages from '../utils/messages';

class UsuarioController {
  private ftpAvatar = `${serverConfig.baseUrl}/${serverConfig.path.userAvatar}`;

  private dirAvatar = serverConfig.dir.userAvatar;

  constructor() {
    this.user = this.user.bind(this);
  }

  public async user(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const user = await Usuario.find(Number(id));

      if (user) {
        user.foto = await Foto.find(user.id);

        // Gravando imagem na pasta do servidor
        if (user.foto.id) {
          const fileName = `avatar_${user.id}.jpg`;

          const bufferImage: Buffer = await blobToBuffer(user.foto.blobFoto);
          await promisify(writeFile)(`${this.dirAvatar}/${fileName}`, bufferImage, { flag: 'w' });

          // Definindo Url da imagem
          user.foto.url_foto = `${this.ftpAvatar}/${fileName}`;
        }

        delete user.foto.blobFoto;
      }

      return res.status(HTTP.OK).json({ user });
    } catch (ex) {
      return res.status(HTTP.BAD_REQUEST).json({ message: 'Usuário não enontrado' });
    }
  }

  public async userByCpfOrCns(req: Request, res: Response): Promise<Response> {
    const { cns, cpf } = req.query;

    if (!cns && !cpf) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: 'Ops! Informe seu CPF ou CNS.',
      });
    }

    try {
      const cpfNumbers = cpf ? extractNumbersFromString(cpf) : null;
      const value = cpf ? cpfNumbers : cns;
      const search = cpf ? 'cpf' : 'cns';

      const user = await Usuario.verificaUsuario(value, search);

      if (!user.id) {
        return res.status(HTTP.BAD_REQUEST).json({
          message: 'Usuário não encontrado.',
        });
      }

      return res.status(HTTP.OK).json(user);
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: 'Problemas ao buscar usuário.',
      });
    }
  }

  public async store(req: Request, res: Response): Promise<Response> {
    const itens = req.body;

    try {
      await Usuario.insert(itens);

      return res.status(HTTP.OK).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (ex) {
      return res.status(HTTP.BAD_REQUEST).json({ message: 'Problemas ao cadastrar usuário.' });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const itens = req.body;

    if (emptyObject(itens)) {
      return res.status(HTTP.BAD_REQUEST).json({ message: 'Nenhum dado informado para atualizar.' });
    }

    try {
      // Se foi solicitado upadate da senha
      if (itens.senha) {
        itens.SENHA = md5(itens.senha);
        delete itens.senha;
      }

      const updates = { ...itens } as IRG_SAUDE_USUARIO;

      await Usuario.update(Number(id), updates);

      return res.status(HTTP.OK).json({ message: 'Dados atualizados com sucesso!' });
    } catch (ex) {
      return res.status(HTTP.BAD_REQUEST).json({ message: 'Problemas ao tentar atualizar dados.' });
    }
  }

  public async newPassword(req: Request, res: Response): Promise<Response> {
    const { userId, cpf, cns } = req.body;

    if (!userId || (!cpf && !cns)) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: 'Usuário não identificado.',
      });
    }

    try {
      // Buscando dados do usuário
      const user = await Usuario.find(Number(userId));

      // Verificando se o CPF/CNS do usuário corresponde com os dados do usuário
      if (cpf) {
        if (extractNumbersFromString(user.cpf) !== cpf) {
          return res.status(HTTP.UNAUTHORIZED).json({
            message: 'Os dados fornecidos para atualização de senha são inválidos.',
          });
        }
      } else if (user.cns !== cns) {
        return res.status(HTTP.UNAUTHORIZED).json({
          message: 'Os dados fornecidos para atualização de senha são inválidos.',
        });
      }

      const password = generatePassword(6);
      const passwordHash = md5(password);

      await Usuario.update(Number(userId), {
        SENHA: passwordHash,
        ULTIMO_ACESSO: null,
      });

      // Enviando SMS com a senha para o usuário
      const resultSMS = await sendForSingleUser(
        'RGSAUDE',
        `55${extractNumbersFromString(user.telefone)}`,
        messages.individuo.sms_cadastroRealizado(password),
      );

      console.log('Resposta SMS: ', resultSMS, password);

      // Extraindo resposta do XML
      const [, valueSMS] = resultSMS.match(/<string .*>(.*?)<\/string>/);

      if (valueSMS !== 'OK') {
        return res.status(HTTP.BAD_REQUEST).json({
          message: 'Problemas ao tentar enviar SMS com sua senha de acesso. Por favor, tente novamente.',
        });
      }

      return res.status(HTTP.OK).json({
        message: 'Enviamos um SMS com sua nova de acesso para seu telefone.',
      });
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: 'Problemas ao tentar gerar nova senha de acesso.',
      });
    }
  }

  public async verificaSenha(req: Request, res: Response): Promise<Response> {
    const itens = req.body;
    const { id } = req.params;

    const userId = Number(id);

    try {
      const schema = Yup.object().shape({
        senha: Yup.string()
          .required()
          .min(6),
        userId: Yup.number()
          .required(),
      });

      await schema.validate({ ...itens, userId }, {
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
      const user = await Usuario.find(userId);

      try {
        Usuario.checkPassword(user.senha, itens.senha);

        return res.status(HTTP.OK).json({
          status: true,
          message: 'OK',
        });
      } catch (error) {
        return res.status(HTTP.UNAUTHORIZED).json({
          status: false,
          message: 'Senha incorreta.',
        });
      }
    } catch (ex) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: 'Usuário não encontrado.',
        isValid: false,
      });
    }
  }
}

export default new UsuarioController();
