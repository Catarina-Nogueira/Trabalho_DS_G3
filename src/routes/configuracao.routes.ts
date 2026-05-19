import { Router } from 'express';
import { ConfiguracaoController } from '../controllers/configuracao.controller';

const router = Router();

router.get('/', ConfiguracaoController.listarTodos);                                    // RF12
router.get('/nome/:nome_parametro', ConfiguracaoController.buscarPorNome);              // RF11
router.get('/:id', ConfiguracaoController.buscarPorId);                                 // RF12
router.post('/', ConfiguracaoController.criar);                                         // RF12
router.put('/:id', ConfiguracaoController.atualizar);                                   // RF11/RF13
router.delete('/:id', ConfiguracaoController.eliminar);                                 // RF12

export default router;