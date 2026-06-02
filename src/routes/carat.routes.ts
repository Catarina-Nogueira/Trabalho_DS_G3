import { Router } from 'express';
import { CaratController } from '../controllers/carat.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

router.get('/questionario-ativo', autenticarSessao, autorizarSessao('administrador', 'medico', 'utente'), CaratController.getQuestionarioAtivo);
router.post('/avaliacoes', autenticarSessao, autorizarSessao('utente'), CaratController.submeterAvaliacao);
router.get('/utentes/:id_utente/avaliacoes', autenticarSessao, autorizarSessao('medico', 'utente'), CaratController.getAvaliacoesUtente);
router.get('/avaliacoes/:id', autenticarSessao, autorizarSessao('medico', 'utente'), CaratController.getDetalheAvaliacao);
router.get('/avaliacoes/:id/recomendacoes', autenticarSessao, autorizarSessao('medico', 'utente'), CaratController.getRecomendacoes);
router.get('/medico/utentes/:id_utente/avaliacoes', autenticarSessao, autorizarSessao('medico'), CaratController.getAvaliacoesMedico);
router.post('/questionarios', autenticarSessao, autorizarSessao('administrador'), CaratController.criarQuestionario);
router.patch('/questionarios/:id/desativar', autenticarSessao, autorizarSessao('administrador'), CaratController.desativarQuestionario);
router.post('/questoes', autenticarSessao, autorizarSessao('administrador'), CaratController.criarQuestao);
router.post('/opcoes-resposta', autenticarSessao, autorizarSessao('administrador'), CaratController.criarOpcaoResposta);

export default router;