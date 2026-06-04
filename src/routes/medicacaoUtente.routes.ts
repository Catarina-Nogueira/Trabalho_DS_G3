import { Router } from 'express';
import { MedicacaoUtenteController } from '../controllers/medicacaoUtente.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

router.get('/historico/:id_utente', autenticarSessao, autorizarSessao('medico', 'utente'), MedicacaoUtenteController.listarPorUtente);
router.get('/ativas/:id_utente', autenticarSessao, autorizarSessao('medico', 'utente'), MedicacaoUtenteController.listarAtivasPorUtente);
router.get('/emitidas/:id_medico', autenticarSessao, autorizarSessao('medico'), MedicacaoUtenteController.listarPorMedico);
router.post('/:id_utente', autenticarSessao, autorizarSessao('medico'), MedicacaoUtenteController.criar);
router.patch('/:id', autenticarSessao, autorizarSessao('medico'), MedicacaoUtenteController.atualizar);
router.patch('/:id/encerrar', autenticarSessao, autorizarSessao('medico'), MedicacaoUtenteController.encerrar);

export default router;