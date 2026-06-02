import { Router } from 'express';
import { AlertaController } from '../controllers/alerta.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

router.get('/medico', autenticarSessao, autorizarSessao('medico'), AlertaController.listarPorMedico); // RF36
router.get('/utente', autenticarSessao, autorizarSessao('utente'), AlertaController.listarPorUtente); // RF38
router.get('/:id', autenticarSessao, autorizarSessao('medico', 'utente'), AlertaController.buscarPorId);
router.patch('/:id/estado', autenticarSessao, autorizarSessao('medico'), AlertaController.atualizarEstado); // RF34

export default router;