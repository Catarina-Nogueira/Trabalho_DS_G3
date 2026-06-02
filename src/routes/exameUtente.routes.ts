import { Router } from 'express';
import { ExameUtenteController } from '../controllers/exameUtente.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

// Históricos e Listagens Contextualizadas
router.get('/historico', autenticarSessao, autorizarSessao('medico', 'utente'), ExameUtenteController.listarPorUtente); // RF48
router.get('/pendentes', autenticarSessao, autorizarSessao('medico', 'utente'), ExameUtenteController.listarPendentesPorUtente); // RF48
router.get('/requisitados', autenticarSessao, autorizarSessao('medico'), ExameUtenteController.listarPorMedico);

// Fluxo Clínico e Operações
router.get('/:id', autenticarSessao, autorizarSessao('medico', 'utente'), ExameUtenteController.buscarPorId); // RF48
router.post('/', autenticarSessao, autorizarSessao('medico'), ExameUtenteController.criar); // RF46
router.patch('/:id/resultado', autenticarSessao, autorizarSessao('medico'), ExameUtenteController.registarResultado); // RF47
router.delete('/:id', autenticarSessao, autorizarSessao('medico'), ExameUtenteController.eliminar);

export default router;