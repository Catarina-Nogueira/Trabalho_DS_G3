import { Router } from 'express';
import { SintomaReportadoController } from '../controllers/sintomaReportado.controller';
import { autorizarSessao } from '../middleware.autorizar';
import { autenticarSessao } from '../middleware.sessao';

const router = Router();


router.post('/utente/:id_utente', autenticarSessao, autorizarSessao('utente'), SintomaReportadoController.reportar);
router.get('/utente/:id_utente/historico', autenticarSessao, autorizarSessao('medico', 'utente'), SintomaReportadoController.listarHistoricoPorUtente);
router.get('/', autenticarSessao, autorizarSessao('medico'), SintomaReportadoController.listarTodos);
router.get('/:id', autenticarSessao, autorizarSessao('medico'), SintomaReportadoController.buscarPorId);

export default router;