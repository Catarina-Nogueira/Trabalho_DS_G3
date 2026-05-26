import { Router } from 'express';
import { UtilizadorController } from '../controllers/utilizador.controller';

const router = Router();

router.get('/', UtilizadorController.listarTodos);
router.get('/:id', UtilizadorController.buscarPorId);
router.post('/', UtilizadorController.criar);
router.put('/:id', UtilizadorController.atualizar);
router.patch('/:id/desativar', UtilizadorController.desativar);
router.delete('/:id', UtilizadorController.eliminar);

export default router;