import { Router } from 'express';
import { MedicacaoUtenteController } from '../controllers/medicacaoUtente.controller';

const router = Router();

router.get('/utente/:id_utente', MedicacaoUtenteController.listarPorUtente);                // RF45
router.get('/utente/:id_utente/ativas', MedicacaoUtenteController.listarAtivasPorUtente);   // RF45
router.get('/medico/:id_medico', MedicacaoUtenteController.listarPorMedico);
router.get('/:id', MedicacaoUtenteController.buscarPorId);                                  // RF45
router.post('/', MedicacaoUtenteController.criar);                                          // RF43
router.put('/:id', MedicacaoUtenteController.atualizar);
router.patch('/:id/encerrar', MedicacaoUtenteController.encerrar);                          // RF44

export default router;