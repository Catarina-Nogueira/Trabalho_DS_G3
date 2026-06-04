import { Router } from 'express';
import { RecomendacaoController } from '../controllers/recomendacao.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

router.get('/', autenticarSessao, autorizarSessao('administrador'), RecomendacaoController.listarTodos);
router.get('/:id', autenticarSessao, autorizarSessao('medico', 'utente'), RecomendacaoController.buscarPorId);
router.get('/avaliacao/:id_avaliacao', autenticarSessao, autorizarSessao('medico', 'utente'), RecomendacaoController.listarPorAvaliacao);
router.get('/utente/:id_utente', autenticarSessao, autorizarSessao('utente'), RecomendacaoController.listarPorUtente);
router.post('/', autenticarSessao, autorizarSessao('medico'), RecomendacaoController.criar);
router.patch('/:id', autenticarSessao, autorizarSessao('administrador', 'medico'), RecomendacaoController.atualizar);
router.delete('/:id', autenticarSessao, autorizarSessao('administrador', 'medico'), RecomendacaoController.eliminar);

export default router;