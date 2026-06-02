import { Router } from 'express';
import { SintomaReportadoController } from '../controllers/sintomaReportado.controller';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();


router.post('/', autorizarSessao('utente'), SintomaReportadoController.reportar);
router.get('/meu-historico', autorizarSessao('utente'), SintomaReportadoController.listarMeuHistorico);
router.get('/', autorizarSessao('administrador', 'medico'), SintomaReportadoController.listarTodos);
router.get('/:id', autorizarSessao('administrador', 'medico'), SintomaReportadoController.buscarPorId);


export default router;