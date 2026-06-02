import { Router } from 'express';
import { ConfiguracaoController } from '../controllers/configuracao.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

// Aplica proteção de sessão e perfil restrito de Administrador a todas as rotas deste módulo
router.use(autenticarSessao);
router.use(autorizarSessao('administrador'));

// Rotas operacionais
router.get('/', ConfiguracaoController.listarTodas);
router.get('/:id', ConfiguracaoController.buscarPorId);
router.post('/', ConfiguracaoController.criar);
router.put('/:id', ConfiguracaoController.atualizar);

export default router;