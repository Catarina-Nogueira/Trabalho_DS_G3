import { Router } from 'express';
import {AutenticacaoController } from '../controllers/autenticacao.controller';
import { autenticar } from '../autenticacao.middleware';

const router = Router();

// POST /auth/login — não precisa de autenticação prévia
router.post('/login', AutenticacaoController.login);

// POST /auth/logout — precisa de token válido
router.post('/logout', autenticar, AutenticacaoController.logout);

export default router;