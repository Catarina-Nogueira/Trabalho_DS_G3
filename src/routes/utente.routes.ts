import { Router } from 'express';
import { UtenteController } from '../controllers/utente.controller';

const router = Router();

router.get('/', UtenteController.listarTodos);
router.get('/medico/:id_medico', UtenteController.listarPorMedico);
router.get('/:id', UtenteController.buscarPorId);                    // RF50
router.get('/:id/dados-permitidos', UtenteController.buscarDadosPermitidos); // RF06
router.post('/', UtenteController.criar);
router.put('/:id', UtenteController.atualizar);                      // RF05
router.delete('/:id', UtenteController.eliminar);

export default router;