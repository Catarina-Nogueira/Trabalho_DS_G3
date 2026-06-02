import { Router } from 'express';
import { UtilizadorController } from '../controllers/utilizador.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

router.get('/', autenticarSessao, autorizarSessao('administrador'), UtilizadorController.listarTodos);
router.get('/:id', autenticarSessao, autorizarSessao('administrador'), UtilizadorController.buscarPorId);
router.post('/', autenticarSessao, autorizarSessao('administrador'), UtilizadorController.criar);
router.put('/:id', autenticarSessao, autorizarSessao('administrador', 'medico', 'utente'), UtilizadorController.atualizar);
router.patch('/:id/desativar', autenticarSessao, autorizarSessao('administrador'), UtilizadorController.desativar);
router.delete('/:id', autenticarSessao, autorizarSessao('administrador'), UtilizadorController.eliminar);

export default router;