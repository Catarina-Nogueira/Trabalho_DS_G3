import { Router } from 'express';
import { QuestaoCaratController } from '../controllers/questaoCarat.controller';

const router = Router();

router.get('/', QuestaoCaratController.listarTodos);
router.get('/:id', QuestaoCaratController.buscarPorId);
router.get('/questionario/:id_questionario', QuestaoCaratController.listarPorQuestionario);
router.post('/', QuestaoCaratController.criar);
router.patch('/:id', QuestaoCaratController.atualizar);
router.delete('/:id', QuestaoCaratController.eliminar);

export default router;