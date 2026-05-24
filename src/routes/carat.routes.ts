// src/routes/carat.routes.ts

import { Router } from 'express';
import { CaratController } from '../controllers/carat.controller';

const router = Router();

// -----------------------------------------------------------------------
// Questionário ativo (qualquer utilizador autenticado)
// -----------------------------------------------------------------------

// GET /carat/questionario-ativo
// RF16 — Obter questionário CARAT ativo com questões e opções
router.get('/questionario-ativo', CaratController.getQuestionarioAtivo);


// -----------------------------------------------------------------------
// Avaliações — Utente
// -----------------------------------------------------------------------

// POST /carat/avaliacoes
// RF17, RF18, RF19, RF20, RF21 — Submeter respostas ao questionário
router.post('/avaliacoes', CaratController.submeterAvaliacao);

// GET /carat/utentes/:id_utente/avaliacoes
// RF22 — Listar histórico de avaliações de um utente
router.get('/utentes/:id_utente/avaliacoes', CaratController.getAvaliacoesUtente);

// GET /carat/avaliacoes/:id
// RF22, RF27 — Ver detalhe de uma avaliação (score + respostas + recomendações)
router.get('/avaliacoes/:id', CaratController.getDetalheAvaliacao);

// GET /carat/avaliacoes/:id/recomendacoes
// RF27, RF28 — Listar recomendações de uma avaliação
router.get('/avaliacoes/:id/recomendacoes', CaratController.getRecomendacoes);


// -----------------------------------------------------------------------
// Avaliações — Médico
// -----------------------------------------------------------------------

// GET /carat/medico/:id_medico/utentes/:id_utente/avaliacoes
// RF23 — Ver histórico de avaliações de um utente (visão médico)
router.get('/medico/:id_medico/utentes/:id_utente/avaliacoes', CaratController.getAvaliacoesMedico);


// -----------------------------------------------------------------------
// Gestão do questionário — Administrador
// -----------------------------------------------------------------------

// POST /carat/questionarios
// RF24 — Criar novo questionário
router.post('/questionarios', CaratController.criarQuestionario);

// PATCH /carat/questionarios/:id/desativar
// RF24 — Desativar um questionário existente
router.patch('/questionarios/:id/desativar', CaratController.desativarQuestionario);

// POST /carat/questoes
// RF24 — Adicionar questão a um questionário
router.post('/questoes', CaratController.criarQuestao);

// POST /carat/opcoes-resposta
// RF24 — Adicionar opção de resposta a uma questão
router.post('/opcoes-resposta', CaratController.criarOpcaoResposta);


export default router;