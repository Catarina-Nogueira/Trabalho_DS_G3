import { Router } from 'express';
import { ExameUtenteController } from '../controllers/exameUtente.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

// Históricos e Listagens Contextualizadas pelo ID do Utente no URL
router.get('/utente/:id_utente/historico', autenticarSessao, autorizarSessao('medico', 'utente'), ExameUtenteController.listarPorUtente); // RF48
router.get('/utente/:id_utente/pendentes', autenticarSessao, autorizarSessao('medico', 'utente'), ExameUtenteController.listarPendentesPorUtente); // RF48

// Mantém-se pelo contexto global do médico logado
router.get('/requisitados', autenticarSessao, autorizarSessao('medico'), ExameUtenteController.listarPorMedico);

// Fluxo Clínico (Prescrição associada diretamente ao Utente da URL)
router.post('/utente/:id_utente', autenticarSessao, autorizarSessao('medico'), ExameUtenteController.criar); // RF46

// Operações por ID específico da requisição de exame
router.get('/:id', autenticarSessao, autorizarSessao('medico', 'utente'), ExameUtenteController.buscarPorId); // RF48
router.patch('/:id/resultado', autenticarSessao, autorizarSessao('medico'), ExameUtenteController.registarResultado); // RF47
router.delete('/:id', autenticarSessao, autorizarSessao('medico'), ExameUtenteController.eliminar);

export default router;