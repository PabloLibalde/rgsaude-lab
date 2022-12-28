/* eslint-disable no-await-in-loop */
import { Request, Response } from 'express';
import HTTP from 'http-status-codes';

import Medicamento from '../models/Medicamento';
import UsuarioVinculo from '../models/UsuarioVinculo';

class MedicamentoController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { page } = req.params;
    const id_usuario = req.userId;

    if (!page) {
      return res.status(HTTP.BAD_REQUEST).json({ message: 'Informe a página para busca. Ex: 1' });
    }

    try {
      const usuarios_vinculados = await UsuarioVinculo.getAllByUsuario(id_usuario);

      const historicoMedicamentos = await Medicamento.getHistorico(Number(page), [
        id_usuario,
        ...usuarios_vinculados.map((uv) => uv.id_usuario_vinculado),
      ]);

      for (const hm of historicoMedicamentos) {
        hm.medicamentos = await Medicamento.getMedicamentos(hm.id);
      }

      return res.status(HTTP.OK).json([...historicoMedicamentos]);
    } catch (ex) {
      return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        message: 'Problemas ao buscar registros.',
      });
    }
  }
}

export default new MedicamentoController();
