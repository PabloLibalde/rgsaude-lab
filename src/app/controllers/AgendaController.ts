import { Request, Response } from 'express';
import HTTP from 'http-status-codes';
import * as Yup from 'yup';

import Agenda from '../models/Agenda';
import TipoAgenda from '../models/TipoAgenda';
import UnidadeUsuario from '../models/UnidadeUsuario';
import UsuarioVinculo from '../models/UsuarioVinculo';

import { IRG_SAUDE_AGENDA } from '../models/interfaces/agenda';

class AgendaController {
  public async agendas(req: Request, res: Response): Promise<Response> {
    const { page } = req.params;
    const id_usuario = req.userId;

    if (!page) {
      return res.status(HTTP.BAD_REQUEST).json({ message: 'Informe a página para busca. Ex: 1' });
    }

    try {
      const usuarios_vinculados = await UsuarioVinculo.getAllByUsuario(id_usuario);

      const agendamentos = await Agenda.getAllAgendas(Number(page), [
        id_usuario,
        ...usuarios_vinculados.map((uv) => uv.id_usuario_vinculado),
      ]);


      return res.status(HTTP.OK).json(agendamentos);
    } catch (error) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: 'Problemas ao buscar registros',
      });
    }
  }

  public async store(req: Request, res: Response): Promise<Response> {
    const itens: IRG_SAUDE_AGENDA = req.body;

    // Validação do Formulário
    try {
      const schema = Yup.object().shape({
        ID_PACIENTE: Yup.number()
          .required(),
        ID_TIPO_AGENDA: Yup.number()
          .required(),
        MOTIVO_CONSULTA: Yup.string()
          .max(250)
          .required(),
      });

      await schema.validate(itens, {
        abortEarly: false,
      });
    } catch (ex) {
      if (ex instanceof Yup.ValidationError) {
        return res.status(HTTP.BAD_REQUEST).json({ message: ex.errors.map((err) => err).join(' | ') });
      }
      return res.status(HTTP.BAD_REQUEST).json({ message: ex.message });
    }

    // Verificando se Tipo Agenda possui Id da Unidade
    try {
      const tipoAgenda = await TipoAgenda.find(itens.ID_TIPO_AGENDA);

      if (!tipoAgenda.id_unidade) {
        // Verificando se o paciente estpa vinculado a uma unidade de saúde
        const unidade = await UnidadeUsuario.getUnidadeUsuario(itens.ID_PACIENTE);

        if (!unidade.id) {
          return res.status(HTTP.BAD_REQUEST).json({
            message: 'O paciente selecionado não possui vínculo '
            + 'com uma Unidade de Saúde. Procure a Unidade de Saúde para '
            + 'regularizar a situação do paciente.',
          });
        }
      }
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: 'Não foi possível solicitar a Consulta. '
        + 'Ocorreram problemas ao tentar verificar os dados da Unidade de Saúde.',
      });
    }

    try {
      await Agenda.insert({
        ...itens,
        SITUACAO: 0,
        DATA_SOLICITACAO: new Date(),
      });

      return res.status(HTTP.OK).json({ message: 'Dados inseridos com sucesso!' });
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: `Problemas ao tentar inserir dados. ${ex.message}`,
      });
    }
  }

  public async cancelar(req: Request, res: Response): Promise<Response> {
    const { id_agenda } = req.params;
    const { obs } = req.body;
    const id_usuario = req.userId;

    try {
      const dadosAgenda = await Agenda.find(Number(id_agenda));

      if (dadosAgenda.situacao !== 0) {
        return res.status(HTTP.BAD_REQUEST).json({
          message: 'O agendamento não se encontrar com a situação Solicitado,'
                 + 'portanto não pode ser cancelado',
        });
      }
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: 'Problemas ao verificar dados da agenda!',
      });
    }

    try {
      await Agenda.update(Number(id_agenda), {
        SITUACAO: 2,
        OBS: obs || `Cancelado pelo usuário do App: ${id_usuario}`,
      });

      return res.status(HTTP.OK).json({ message: 'Agendamento Cancelado com sucesso!' });
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ message: 'Problemas ao tentar cancelar agendamento.' });
    }
  }
}

export default new AgendaController();
