import { Router } from 'express';
import { SintomaReportadoController } from '../controllers/sintomaReportado.controller';

const router = Router();

router.get('/', SintomaReportadoController.listarTodos);
router.get('/:id', SintomaReportadoController.buscarPorId);
router.get('/utente/:id_utente', SintomaReportadoController.listarPorUtente);
router.post('/', SintomaReportadoController.reportar);
router.patch('/:id', SintomaReportadoController.atualizar);
router.delete('/:id', SintomaReportadoController.eliminar);

export default router;