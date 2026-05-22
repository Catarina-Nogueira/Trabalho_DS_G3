import { Router } from 'express';
import { RecomendacaoController } from '../controllers/recomendacao.controller';

const router = Router();

router.get('/', RecomendacaoController.listarTodos);
router.get('/:id', RecomendacaoController.buscarPorId);
router.get('/avaliacao/:id_avaliacao', RecomendacaoController.listarPorAvaliacao);
router.get('/utente/:id_utente', RecomendacaoController.listarPorUtente);
router.get('/utente/:id_utente/medico/:id_medico', RecomendacaoController.listarPorUtenteParaMedico);
router.post('/', RecomendacaoController.criar);
router.patch('/:id', RecomendacaoController.atualizar);
router.delete('/:id', RecomendacaoController.eliminar);

export default router;