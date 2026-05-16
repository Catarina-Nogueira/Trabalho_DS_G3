import { Router } from 'express';
import { AdministradorController } from '../controllers/administrador.controller';

const router = Router();

router.get('/', AdministradorController.listarTodos);
router.get('/:id', AdministradorController.buscarPorId);
router.post('/', AdministradorController.criar);
router.delete('/:id', AdministradorController.eliminar);

export default router;