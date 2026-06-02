import { Router } from 'express';
import { AdministradorController } from '../controllers/administrador.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

router.get('/', autenticarSessao, autorizarSessao('administrador'), AdministradorController.listarTodos);
router.get('/:id', autenticarSessao, autorizarSessao('administrador'), AdministradorController.buscarPorId);
router.post('/utilizador/:id_utilizador', autenticarSessao, autorizarSessao('administrador'), AdministradorController.criar);
router.put('/:id', autenticarSessao, autorizarSessao('administrador'), AdministradorController.atualizar);
router.delete('/:id', autenticarSessao, autorizarSessao('administrador'), AdministradorController.eliminar);

export default router;