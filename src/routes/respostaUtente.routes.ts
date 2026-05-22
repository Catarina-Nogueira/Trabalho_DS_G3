import { Router } from 'express';
import { RespostaUtenteController } from '../controllers/respostaUtente.controller';

const router = Router();

router.get('/', RespostaUtenteController.listarTodos);
router.get('/:id', RespostaUtenteController.buscarPorId);
router.get('/avaliacao/:id_avaliacao', RespostaUtenteController.listarPorAvaliacao);
router.post('/', RespostaUtenteController.criar);
router.post('/submeter', RespostaUtenteController.submeterRespostas);
router.delete('/:id', RespostaUtenteController.eliminar);
router.delete('/avaliacao/:id_avaliacao', RespostaUtenteController.eliminarPorAvaliacao);

export default router;