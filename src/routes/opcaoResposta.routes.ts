import { Router } from 'express';
import { OpcaoRespostaController } from '../controllers/opcaoResposta.controller';

const router = Router();

router.get('/', OpcaoRespostaController.listarTodos);
router.get('/:id', OpcaoRespostaController.buscarPorId);
router.get('/questao/:id_questao', OpcaoRespostaController.listarPorQuestao);
router.post('/', OpcaoRespostaController.criar);
router.patch('/:id', OpcaoRespostaController.atualizar);
router.delete('/:id', OpcaoRespostaController.eliminar);

export default router;