import { Router } from 'express';
import { SintomaReportadoController } from '../controllers/sintomaReportado.controller';
import { autorizarSessao } from '../middleware.autorizar';
import { autenticarSessao } from '../middleware.sessao';

const router = Router();

router.post('/', (req, res, next) => {
    console.log("--> HEADERS RECEBIDOS NO EXPRESS:", req.headers);
    next();
}, autenticarSessao, autorizarSessao('utente'), SintomaReportadoController.reportar);
//router.post('/', autenticarSessao,autorizarSessao('utente'), SintomaReportadoController.reportar);
router.get('/historico', autenticarSessao, autorizarSessao('utente'), SintomaReportadoController.listarMeuHistorico);
router.get('/', autenticarSessao, autorizarSessao('administrador', 'medico'), SintomaReportadoController.listarTodos);
router.get('/:id', autenticarSessao, autorizarSessao('administrador', 'medico'), SintomaReportadoController.buscarPorId);


export default router;