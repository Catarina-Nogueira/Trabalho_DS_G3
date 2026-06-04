import { Router } from 'express';
import { MedicoController } from '../controllers/medico.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

router.get('/', autenticarSessao, autorizarSessao('administrador', 'medico', 'utente'), MedicoController.listarTodos);
router.get('/:id', autenticarSessao, autorizarSessao('administrador', 'medico'), MedicoController.buscarPorId);
router.post('/utilizador/:id_utilizador', autenticarSessao, autorizarSessao('administrador'), MedicoController.criar);
router.patch('/:id', autenticarSessao, autorizarSessao('administrador'), MedicoController.atualizar);
router.delete('/:id', autenticarSessao, autorizarSessao('administrador'), MedicoController.eliminar);

export default router;