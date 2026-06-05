import { Router } from 'express';
import { UtenteController } from '../controllers/utente.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();


router.get('/', autenticarSessao, autorizarSessao('administrador', 'medico'), UtenteController.listarTodos);
router.get('/medico/:id_medico', autenticarSessao, autorizarSessao('administrador', 'medico'), UtenteController.listarPorMedico);
router.get('/:id', autenticarSessao, autorizarSessao('administrador', 'medico', 'utente'), UtenteController.buscarPorId);
router.get('/dados-permitidos', autenticarSessao, autorizarSessao('administrador', 'medico', 'utente'), UtenteController.buscarDadosPermitidos);
router.post('/utilizador/:id_utilizador', autenticarSessao, autorizarSessao('administrador'), UtenteController.criar);
router.put('/:id', autenticarSessao, autorizarSessao('administrador', 'utente'), UtenteController.atualizar);
router.delete('/:id', autenticarSessao, autorizarSessao('administrador'), UtenteController.eliminar);

export default router;