import { Router } from 'express';
import { AuditoriaController } from '../controllers/auditoria.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

router.use(autenticarSessao);
router.use(autorizarSessao('administrador'));

// GET /auditorias
router.get('/', AuditoriaController.listarLogs);

export default router;