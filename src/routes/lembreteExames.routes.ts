import { Router } from 'express';
import { LembreteController } from '../controllers/lembreteExames.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

router.use(autenticarSessao);
router.use(autorizarSessao('administrador', 'medico'));
router.get('/proximos', LembreteController.listarProximosLembretes);
router.post('/disparar-manual', autorizarSessao('administrador'), LembreteController.forcarDisparoLembretes);

export default router;