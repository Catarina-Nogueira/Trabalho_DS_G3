import { Router } from 'express';
import { ExameController } from '../controllers/exame.controller';

const router = Router();

router.get('/', ExameController.listarTodos);
router.get('/nome/:nome_exame', ExameController.buscarPorNome);  // antes do /:id
router.get('/:id', ExameController.buscarPorId);
router.post('/', ExameController.criar);                          // RF46
router.put('/:id', ExameController.atualizar);
router.delete('/:id', ExameController.eliminar);

export default router;