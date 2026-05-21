import { Router } from 'express';
import { PermissaoController } from '../controllers/permissao.controller';

const router = Router();

router.get('/', PermissaoController.listarTodos);
router.get('/:id', PermissaoController.buscarPorId);
router.post('/', PermissaoController.criar);
router.patch('/:id', PermissaoController.atualizar);
router.delete('/:id', PermissaoController.eliminar);

export default router;