import { Router } from 'express';
import { MedicacaoController } from '../controllers/medicacao.controller';

const router = Router();

router.get('/', MedicacaoController.listarTodos);
router.get('/nome/:nome_medicamento', MedicacaoController.buscarPorNome);  // antes do /:id
router.get('/:id', MedicacaoController.buscarPorId);
router.post('/', MedicacaoController.criar);                               // RF43
router.put('/:id', MedicacaoController.atualizar);
router.delete('/:id', MedicacaoController.eliminar);

export default router;