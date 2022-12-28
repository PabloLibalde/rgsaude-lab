/* eslint-disable no-await-in-loop */
import { Request, Response } from 'express';
import { readdir, writeFile } from 'fs';
import HTTP from 'http-status-codes';
import md5 from 'md5';
import { promisify } from 'util';

import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import serverConfig from '../../config/serverConfig';

import { sendForSingleUser } from '../services/SMSService';
import * as Utils from '../utils';
import messages from '../utils/messages';

import Foto from '../models/Foto';
import Usuario from '../models/Usuario';

import Individuo from '../models/Individuo';
import { ITSI_CADPAC } from '../models/interfaces/individuo';
import UsuarioVinculo from '../models/UsuarioVinculo';

class IndividuoController {
  private ftpAvatar = `${serverConfig.baseUrl}/${serverConfig.path.userAvatar}`;

  private dirAvatar = serverConfig.dir.userAvatar;

  constructor() {
    this.individuosFamilia = this.individuosFamilia.bind(this);
  }

  public async individuosFamilia(req: Request, res: Response): Promise<Response> {
    /**
     * No App, caso exista ID_FAMILIA, esse campo será enviado. Caso contrário
     * ID_ESUS_CADDOMICILIAR será enviado, mas ambos serão recebidos com nome id_familia
     */
    const { id_familia } = req.params;
    const { ibge } = req.headers;
    const id_usuario = req.userId;

    const novaEstrututa = Utils.databaseUseNewStructure(String(ibge));

    try {
      const individuos = await Individuo.getIndividuosFamilia({
        ID_FAMILIA: Number(id_familia),
        ID_ESUS_CADDOMICILIAR: Number(id_familia),
      }, novaEstrututa);

      if (individuos.length === 0) {
        return res.status(HTTP.BAD_REQUEST).json({
          message: 'Nenhum indivíduo encontrado.', data: [],
        });
      }

      try {
        // Listando imagens de avatar na pasta do servidor
        const filesList = await promisify(readdir)(this.dirAvatar);

        for (const individuo of individuos) {
          // Verificando se o indivíduo possui cadastro no App
          const user = await Usuario.find(individuo.id);
          individuo.cadastro_app = !!user.id;

          // Verificando usuários vinculados
          const vinculado = await UsuarioVinculo.find({
            ID_USUARIO: id_usuario,
            ID_USUARIO_VINCULADO: individuo.id,
          });
          individuo.vinculado = !!vinculado;

          // Lendo/gerando avatar de usuário
          const fileName = `avatar_${individuo.id}.jpg`;
          const [imageExists] = filesList.filter((file) => file === fileName);

          if (!imageExists) {
            individuo.foto = await Foto.find(individuo.id);

            // Gravando imagem na pasta do servidor
            if (individuo.foto.id) {
              const bufferImage: Buffer = await Utils.blobToBuffer(individuo.foto.blobFoto);
              await promisify(writeFile)(`${this.dirAvatar}/${fileName}`, bufferImage, { flag: 'w' });

              individuo.foto.url_foto = `${this.ftpAvatar}/${fileName}`;
              delete individuo.foto.blobFoto;
            }
          } else {
            individuo.foto = {
              id_usuario: individuo.id,
              url_foto: `${this.ftpAvatar}/${fileName}`,
            };
          }
        }

        return res.status(HTTP.OK).json([...individuos]);
      } catch (ex) {
        return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
          message: messages.msg_padrao.erro_buscarRegistro,
        });
      }
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: 'Problemas ao buscar dados do Indivíduo.', data: [],
      });
    }
  }

  public async criaCadastroApp(req: Request, res: Response): Promise<Response> {
    const { id, telefone } = req.body;
    const { ibge } = req.headers;

    const novaEstrututa = Utils.databaseUseNewStructure(String(ibge));

    if (!telefone) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: 'Não foram informados os dados necessários para criar seu cadastro.',
      });
    }

    const password = Utils.generatePassword(6);
    const passwordHash = md5(password);

    console.log('password', password);

    // Atualizando cadastro do indivíduo
    try {
      await Individuo.update(Number(id), { CSI_CELULAR: telefone });
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: 'Problemas ao tentar atualizar dados do indivíduo.',
      });
    }

    // Buscando dados do indivíduo
    try {
      // Verificando se já existe cadastro do usuário
      const usuario = await Usuario.find(Number(id));

      if (!usuario.id) {
        const individuo = await Individuo.find(Number(id));

        // Definindo id da família de acordo com estrutura do banco
        const familia = novaEstrututa
          ? { ID_FAMILIA: individuo.id_familia }
          : { ID_ESUS_CADDOMICILIAR: individuo.id_esus_caddomiciliar };

        try {
          // Criando cadastro do usuário
          await Usuario.insert({
            ID: individuo.id,
            NOME: individuo.nome,
            SEXO: individuo.sexo,
            CPF: individuo.cpf,
            CNS: individuo.cns,
            DATA_NASCIMENTO: individuo.data_nascimento,
            CELULAR: individuo.telefone,
            EMAIL: individuo.email,
            SENHA: passwordHash,
            CRIADO_EM: new Date(),
            ATUALIZADO_EM: new Date(),
            ...familia,
          });
        } catch (ex) {
          return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
            message: 'Problemas ao tentar criar cadastro de usuário.',
          });
        }
      } else {
        // Atualizando cadastro do usuário
        try {
          await Usuario.update(Number(id), {
            SENHA: passwordHash,
            ATUALIZADO_EM: new Date(),
            ULTIMO_ACESSO: null,
          });
        } catch (ex) {
          console.error(ex.message);
          return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
            message: 'Problemas ao tentar criar cadastro de usuário.',
          });
        }
      }

      // Enviando SMS com a senha para o usuário
      const resultSMS = await sendForSingleUser(
        'RGSAUDE',
        `55${Utils.extractNumbersFromString(telefone)}`,
        messages.individuo.sms_cadastroRealizado(password),
      );

      console.log('Resposta SMS: ', resultSMS);

      // Extraindo resposta do XML
      const [, valueSMS] = resultSMS.match(/<string .*>(.*?)<\/string>/);

      if (valueSMS !== 'OK') {
        return res.status(HTTP.BAD_REQUEST).json({
          message: 'Problemas ao tentar enviar SMS com sua senha de acesso. Por favor, tente novamente.',
        });
      }

      return res.status(HTTP.OK).json({ message: 'Cadastro realizado com sucesso!' });
    } catch (ex) {
      console.error(ex.message);
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: 'Problemas ao buscar dados do indivíduo.',
      });
    }
  }

  public async verificaCadastro(req: Request, res: Response): Promise<Response> {
    interface IValid {
      isValid: boolean;
      message: string;
    }

    // Recebendo dados da requisição
    const {
      etapa,
      cpf,
      cns,
      nome_completo,
      data_nascimento,
      nome_mae,
    } = req.body;

    // Declaração das variáveis
    const returnEtapa = Number(etapa);

    if (![0, 1, 2, 3].includes(Number(etapa))) {
      return res.status(HTTP.BAD_REQUEST).json({ message: 'Os dados fornecidos são inválidos.' });
    }

    const cpfNumbers = cpf ? Utils.extractNumbersFromString(cpf) : null;

    // Declaração das funções

    /**
     *
     * @param dbnome Nome no banco de dados
     * @param inputnome Nome informado pelo usuário
     */
    function validaNomeCompleto(dbnome: string, inputnome: string): IValid {
      const db_nome = Utils.removeAccents(dbnome).toLocaleUpperCase().trim();
      const input_nome = Utils.removeAccents(inputnome).toLocaleUpperCase().trim();

      return (db_nome === input_nome)
        ? { isValid: true, message: 'OK' }
        : { isValid: false, message: messages.individuo.erro_validaNomeCompleto };
    }

    /**
     *
     * @param dbdtnasc Data de nascimento no banco de dados
     * @param inputdtnasc Data de nascimento informado pelo usuário
     */
    function validaDataNascimento(dbdtnasc: Date, inputdtnasc: string): IValid {
      const db_dtnasc = format(dbdtnasc, 'dd/MM/yyyy', { locale: pt });
      const input_dtnasc = inputdtnasc.trim();

      return (db_dtnasc === input_dtnasc)
        ? { isValid: true, message: 'OK' }
        : { isValid: false, message: messages.individuo.erro_validaDataNascimento };
    }

    /**
     *
     * @param dbnomemae Nome da mãe no banco de dados
     * @param inputnomemae Nome da mãe informado pelo usuário
     */
    function validaNomeMae(dbnomemae: string, inputnomemae: string): IValid {
      const db_nomemae = Utils.removeAccents(dbnomemae).toLocaleUpperCase().trim();
      const input_nomemae = Utils.removeAccents(inputnomemae).toLocaleUpperCase().trim();

      return (db_nomemae === input_nomemae)
        ? { isValid: true, message: 'OK' }
        : { isValid: false, message: messages.individuo.erro_ValidaNomeMae };
    }

    // Buscando dados do usuário
    const value = cpf ? cpfNumbers : cns;
    const search = cpf ? 'cpf' : 'cns';

    // try {
    //   // Buscando correspondência na tabela de usuários do App
    //   const userExists = await Usuario.verificaUsuario(value, search);

    //   // Se o usuário já possui cadastro no App
    //   if (userExists.id) {
    //     return res.status(HTTP.BAD_REQUEST).json({
    //       etapa: returnEtapa,
    //       isValid: false,
    //       message: messages.individuo.erro_individuoPossuiCadastroApp(search),
    //     });
    //   }
    // } catch (ex) {
    //   return res.status(HTTP.BAD_REQUEST).json({
    //     message: 'Problemas ao verificar dados do usuário.',
    //   });
    // }

    try {
      // Buscando dados do indivíduo
      const individuo = await Individuo.verificaIndividuo(value, search);

      // Se não encontrou indivíduo
      if (!individuo.id) {
        return res.status(HTTP.BAD_REQUEST).json({
          etapa: returnEtapa,
          isValid: false,
          message: messages.individuo.erro_individuoNaoCadastrado,
        });
      }

      if (!individuo.id_familia && !individuo.id_esus_caddomiciliar) {
        return res.status(HTTP.BAD_REQUEST).json({
          etapa: returnEtapa,
          isValid: false,
          message: messages.individuo.erro_individuoNaoPossuiVinculoFamilia,
        });
      }

      // Indivíduo encontrado, primeira etapa de validação
      if (Number(etapa) === 0) {
        return res.status(HTTP.OK).json({
          etapa: returnEtapa + 1,
          isValid: true,
          message: 'OK',
        });
      }

      // Processos de validação após indivíduo ter sido encontrado
      const functions = [validaNomeCompleto, validaDataNascimento, validaNomeMae];
      const parameters = [
        [individuo.nome, nome_completo],
        [individuo.data_nascimento, data_nascimento],
        [individuo.nome_mae, nome_mae],
      ];

      // Chama função de validação de acordo com a etapa
      const resFunction = functions[etapa - 1](parameters[etapa - 1][0], parameters[etapa - 1][1]);

      // Retorno da validação
      return res.status(resFunction.isValid ? HTTP.OK : HTTP.BAD_REQUEST).json({
        etapa: resFunction.isValid ? returnEtapa + 1 : returnEtapa,
        isValid: resFunction.isValid,
        message: resFunction.message,
        user: (returnEtapa === 3) ? individuo : null,
      });
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: 'Problemas ao tentar validar cadastro.',
      });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const id_usuario = Number(req.userId);
    const { body } = req.body;

    try {
      await Individuo.update(id_usuario, {
        CSI_CELULAR: body.telefone,
      } as ITSI_CADPAC);

      return res.status(HTTP.OK).json({ message: 'Dados atualizados com sucesso!' });
    } catch (ex) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: 'Problemas ao tentar atualizar dados!',
      });
    }
  }
}

export default new IndividuoController();
