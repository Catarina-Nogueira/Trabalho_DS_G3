import { Router } from 'express';
import { AuditoriaController } from '../controllers/auditoria.controller';

const router = Router();

router.get('/', AuditoriaController.listarComFiltros);       // RF57
router.get('/exportar', AuditoriaController.exportar);       // RF58

export default router;