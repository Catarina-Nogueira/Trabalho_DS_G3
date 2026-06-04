import { Router } from 'express';
import { MedicacaoUtenteController } from '../controllers/medicacaoUtente.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

// Rotas de listagem contextualizadas (Protegidas)
router.get('/historico', autenticarSessao, autorizarSessao('medico', 'utente'), MedicacaoUtenteController.listarPorUtente); // RF45
router.get('/ativas', autenticarSessao, autorizarSessao('medico', 'utente'), MedicacaoUtenteController.listarAtivasPorUtente); // RF45
router.get('/emitidas', autenticarSessao, autorizarSessao('medico'), MedicacaoUtenteController.listarPorMedico);

// Detalhes, Criação e Fluxo Clínico
router.post('/:id_utente', autenticarSessao, autorizarSessao('medico'), MedicacaoUtenteController.criar); // RF43
router.put('/:id', autenticarSessao, autorizarSessao('medico'), MedicacaoUtenteController.atualizar);
router.patch('/:id/encerrar', autenticarSessao, autorizarSessao('medico'), MedicacaoUtenteController.encerrar); // RF44

export default router;