import { Router } from 'express';
import { UtilizadorController } from '../controllers/utilizador.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

router.get('/', autenticarSessao, autorizarSessao('Administrador'), UtilizadorController.listarTodos);
router.get('/:id', autenticarSessao, autorizarSessao('Administrador', 'medico', 'utente'), UtilizadorController.buscarPorId);
router.post('/', autenticarSessao, autorizarSessao('Administrador'), UtilizadorController.criar);
router.put('/:id', autenticarSessao, autorizarSessao('Administrador', 'medico', 'utente'), UtilizadorController.atualizar);
router.patch('/:id/desativar', autenticarSessao, autorizarSessao('Administrador'), UtilizadorController.desativar);
router.delete('/:id', autenticarSessao, autorizarSessao('Administrador'), UtilizadorController.eliminar);

export default router;