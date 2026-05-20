import { Router } from 'express';
import { ExameUtenteController } from '../controllers/exameUtente.controller';

const router = Router();

router.get('/utente/:id_utente', ExameUtenteController.listarPorUtente);                    // RF48
router.get('/utente/:id_utente/pendentes', ExameUtenteController.listarPendentesPorUtente); // RF48
router.get('/medico/:id_medico', ExameUtenteController.listarPorMedico);
router.get('/:id', ExameUtenteController.buscarPorId);                                      // RF48
router.post('/', ExameUtenteController.criar);                                              // RF46
router.patch('/:id/resultado', ExameUtenteController.registarResultado);                    // RF47
router.delete('/:id', ExameUtenteController.eliminar);

export default router;