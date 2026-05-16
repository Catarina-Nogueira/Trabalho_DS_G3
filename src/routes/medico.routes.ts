import { Router } from 'express';
import { MedicoController } from '../controllers/medico.controller';

const router = Router();

router.get('/', MedicoController.listarTodos);
router.get('/:id', MedicoController.buscarPorId);
router.post('/', MedicoController.criar);
router.patch('/:id/telemovel', MedicoController.atualizarTelemovel);
router.delete('/:id', MedicoController.eliminar);

export default router;



