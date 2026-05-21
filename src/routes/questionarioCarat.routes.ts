import { Router } from 'express';
import { QuestionarioCaratController } from '../controllers/questionarioCarat.controller';

const router = Router();

router.get('/', QuestionarioCaratController.listarTodos);
router.get('/ativo', QuestionarioCaratController.obterAtivo);
router.get('/:id', QuestionarioCaratController.buscarPorId);
router.post('/', QuestionarioCaratController.criar);
router.patch('/:id/ativar', QuestionarioCaratController.ativar);
router.patch('/:id/desativar', QuestionarioCaratController.desativar);
router.delete('/:id', QuestionarioCaratController.eliminar);

export default router;