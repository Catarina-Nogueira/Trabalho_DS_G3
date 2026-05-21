import { Router } from 'express';
import { PlanoAcompanhamentoController } from '../controllers/planoAcompanhamento.controller';

const router = Router();

router.get('/', PlanoAcompanhamentoController.listarTodos);
router.get('/:id', PlanoAcompanhamentoController.buscarPorId);
router.get('/utente/:id_utente', PlanoAcompanhamentoController.listarPorUtente);
router.get('/medico/:id_medico', PlanoAcompanhamentoController.listarPorMedico);
router.post('/', PlanoAcompanhamentoController.criar);
router.patch('/:id', PlanoAcompanhamentoController.atualizar);
router.delete('/:id', PlanoAcompanhamentoController.eliminar);

export default router;