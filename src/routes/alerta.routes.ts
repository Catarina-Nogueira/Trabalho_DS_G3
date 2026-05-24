import { Router } from 'express';
import { AlertaController } from '../controllers/alerta.controller';

const router = Router();

router.get('/medico/:id_medico', AlertaController.listarPorMedico);   // RF36
router.get('/utente/:id_utente', AlertaController.listarPorUtente);   // RF38
router.get('/:id', AlertaController.buscarPorId);
//router.post('/', AlertaController.gerarAlerta);                        // RF29-RF33
router.patch('/:id/estado', AlertaController.atualizarEstado);         // RF34

export default router;