import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multerConfig';

import HomeController from './app/controllers/HomeController';
import UsuarioController from './app/controllers/UsuarioController';
import UsuarioVinculoController from './app/controllers/UsuarioVinculoController';
import IndividuoController from './app/controllers/IndividuoController';
import SessaoController from './app/controllers/SessaoControler';
import DispositivoController from './app/controllers/DispositivoController';
import FotoController from './app/controllers/FotoController';
import NotificacaoController from './app/controllers/NotificacaoController';
import InformacaoController from './app/controllers/InformacaoController';
import InformacaoGostouController from './app/controllers/InformacaoGostouController';
import InformacaoFeedbackController from './app/controllers/InformacaoFeedbackController';
import MedicamentoController from './app/controllers/MedicamentoController';
import ConsultaController from './app/controllers/ConsultaController';
import TransporteController from './app/controllers/TransporteController';
import TipoAgendaController from './app/controllers/TipoAgendaController';
import AgendaController from './app/controllers/AgendaController';

import authMiddleware from './app/middlewares/auth';
import logMiddleware from './app/middlewares/log';
import ibgeMiddleware from './app/middlewares/ibge';

// const timeout = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<NextFunction> => new Promise((resolve) => {
//   setTimeout(() => resolve(next()), 2000);
// });

const upload: multer.Instance = multer(multerConfig);
const routes: Router = Router();

routes.use(logMiddleware);

// routes.use(timeout);

/* ROTAS -> NÃO AUTENTICADAS */

// Home
routes.get('/', HomeController.index);

routes.use(ibgeMiddleware);

// Sessão
routes.post('/session', SessaoController.store); // Login

// Usuário
routes.get('/user/findByCpfOrCns', UsuarioController.userByCpfOrCns);
routes.post('/user/newPassword', UsuarioController.newPassword);

// Indivíduo
routes.post('/individuo/verificaCadastro', IndividuoController.verificaCadastro);
routes.post('/individuo/criaCadastroApp', IndividuoController.criaCadastroApp);

/* ---------------------------------------------------------------------------- */


/* ROTAS -> AUTENTICADAS */

routes.use(authMiddleware); // Adicionando autenticação as rotas

// Usuário
routes.post('/user', UsuarioController.store);
routes.get('/user/:id', UsuarioController.user);
routes.put('/user/:id', UsuarioController.update);
routes.post('/user/:id/verificaSenha', UsuarioController.verificaSenha);

// Usuário Vínculo
routes.get('/usuarioVinculo', UsuarioVinculoController.index);
routes.post('/usuarioVinculo', UsuarioVinculoController.store);
routes.delete('/usuarioVinculo/:id', UsuarioVinculoController.delete);

// Indivíduo
routes.get('/individuo/individuosFamilia/:id_familia', IndividuoController.individuosFamilia);

// Foto
routes.put('/foto/:idusuario', upload.single('file'), FotoController.update);
routes.post('/foto', upload.single('file'), FotoController.store);

// Informação
routes.get('/informacao/:page', InformacaoController.index);
routes.post('/informacao', upload.single('file'), InformacaoController.store);

// Gostou
routes.post('/gostou', InformacaoGostouController.store);
routes.delete('/gostou/:id_informacao', InformacaoGostouController.delete);

// Feedback
routes.get('/feedback/:id_informacao', InformacaoFeedbackController.index);
routes.post('/feedback', InformacaoFeedbackController.store);
routes.delete('/feedback/:id_feedback', InformacaoFeedbackController.delete);

// Dispositivo
routes.post('/dispositivo', DispositivoController.updateOrStore);

// Notificação
routes.post('/notificacao/todos', NotificacaoController.notificationAll);
routes.post('/notificacao/tag', NotificacaoController.notificationByTag);
routes.post('/notificacao/dispositivo', NotificacaoController.notificationByDevice);

// Medicamento
routes.get('/medicamento/:page', MedicamentoController.index);

// Consulta
routes.get('/consulta/andamento/:page', ConsultaController.index);
routes.get('/consulta/historico/:page', ConsultaController.historico);
routes.put('/consulta/confirmar/:id', ConsultaController.confirmar);
routes.put('/consulta/cancelar/:id', ConsultaController.cancelar);

// Transporte
routes.get('/transporte/andamento/:page', TransporteController.emandamento);
routes.get('/transporte/historico/:page', TransporteController.historico);
routes.put('/transporte/confirmar/:id', TransporteController.confirmar);
routes.put('/transporte/cancelar/:id', TransporteController.cancelar);

// Tipo de Agenda
routes.get('/tipoagenda', TipoAgendaController.index);

// Agendamentos
routes.get('/agenda/agendamentos/:page', AgendaController.agendas);
routes.post('/agenda', AgendaController.store);
routes.put('/agenda/cancelar/:id_agenda', AgendaController.cancelar);

export default routes;
