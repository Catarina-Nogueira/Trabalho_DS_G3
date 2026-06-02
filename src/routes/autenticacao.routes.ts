import { Router } from 'express';
import { AutenticacaoController } from '../controllers/autenticacao.controller';

const router = Router();

router.post('/login', AutenticacaoController.login);
router.post('/logout',AutenticacaoController.logout);

export default router;