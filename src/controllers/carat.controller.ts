// src/controllers/carat.controller.ts

import { Request, Response } from 'express';
import { CaratService } from '../services/carat.service';

export const CaratController = {

    // GET /carat/questionario-ativo
    // RF16 — Retorna o questionário ativo com questões e opções
    getQuestionarioAtivo: async (req: Request, res: Response) => {
        try {
            const questionario = await CaratService.obterQuestionarioAtivo();
            res.json(questionario);
        } catch (err: any) {
            res.status(404).json({ erro: err.message });
        }
    },

    // POST /carat/avaliacoes
    // RF17, RF18, RF19, RF20, RF21, RF25, RF26 — Utente submete respostas
    submeterAvaliacao: async (req: Request, res: Response) => {
        const { id_utente, respostas, id_questionario } = req.body;

        // Validações básicas de entrada
        if (!id_utente || typeof id_utente !== 'number') {
            return res.status(400).json({ erro: 'id_utente é obrigatório e deve ser um número.' });
        }
        if (!id_questionario || typeof id_questionario !== 'number') {
            return res.status(400).json({ erro: 'id_questionario é obrigatório e deve ser um número.' });
        }
        if (!Array.isArray(respostas) || respostas.length === 0) {
            return res.status(400).json({ erro: 'respostas deve ser um array não vazio.' });
        }
        // Verificar que cada resposta tem id_questao e id_opcao
        for (const r of respostas) {
            if (!r.id_questao || !r.id_opcao) {
                return res.status(400).json({ erro: 'Cada resposta deve ter id_questao e id_opcao.' });
            }
        }

        try {
            const resultado = await CaratService.submeterAvaliacao(id_utente, { id_questionario, respostas });
            res.status(201).json(resultado);
        } catch (err: any) {
            // RF18 — Questões por responder
            if (err.code === 'RESPOSTAS_INCOMPLETAS') {
                return res.status(422).json({
                    erro: err.message,
                    questoesPorResponder: err.questoesPorResponder,
                });
            }
            res.status(400).json({ erro: err.message });
        }
    },

    // GET /carat/utentes/:id_utente/avaliacoes
    // RF22 — Histórico de avaliações do utente
    getAvaliacoesUtente: async (req: Request, res: Response) => {
        try {
            const avaliacoes = await CaratService.listarAvaliacoesUtente(Number(req.params.id_utente));
            res.json(avaliacoes);
        } catch (err: any) {
            res.status(500).json({ erro: 'Erro ao listar avaliações do utente.' });
        }
    },

    // GET /carat/avaliacoes/:id
    // RF22, RF27 — Detalhe de uma avaliação (score + respostas + recomendações)
    getDetalheAvaliacao: async (req: Request, res: Response) => {
        try {
            const detalhe = await CaratService.detalheAvaliacao(Number(req.params.id));
            if (!detalhe) return res.status(404).json({ erro: 'Avaliação não encontrada.' });
            res.json(detalhe);
        } catch (err: any) {
            if (err.code === 'FORBIDDEN') return res.status(403).json({ erro: err.message });
            res.status(500).json({ erro: 'Erro ao obter detalhe da avaliação.' });
        }
    },

    // GET /carat/medico/:id_medico/utentes/:id_utente/avaliacoes
    // RF23 — Histórico de avaliações de um utente (visão médico)
    getAvaliacoesMedico: async (req: Request, res: Response) => {
        try {
            const avaliacoes = await CaratService.listarAvaliacoesMedico(
                Number(req.params.id_utente),
                Number(req.params.id_medico),
            );
            res.json(avaliacoes);
        } catch (err: any) {
            if (err.code === 'FORBIDDEN') return res.status(403).json({ erro: err.message });
            res.status(500).json({ erro: 'Erro ao listar avaliações.' });
        }
    },

    // GET /carat/avaliacoes/:id/recomendacoes
    // RF27, RF28 — Listar recomendações de uma avaliação
    getRecomendacoes: async (req: Request, res: Response) => {
        try {
            const recomendacoes = await CaratService.listarRecomendacoes(Number(req.params.id));
            res.json(recomendacoes);
        } catch (err: any) {
            res.status(500).json({ erro: 'Erro ao listar recomendações.' });
        }
    },

    // POST /carat/questionarios
    // RF24 — Criar questionário (Administrador)
    criarQuestionario: async (req: Request, res: Response) => {
        const { versao, data_ativacao } = req.body;
        if (!versao) return res.status(400).json({ erro: 'versao é obrigatória.' });
        if (!data_ativacao) return res.status(400).json({ erro: 'data_ativacao é obrigatória.' });

        try {
            const questionario = await CaratService.criarQuestionario({ versao, data_ativacao });
            res.status(201).json(questionario);
        } catch (err: any) {
            res.status(409).json({ erro: err.message });
        }
    },

    // PATCH /carat/questionarios/:id/desativar
    // RF24 — Desativar questionário (Administrador)
    desativarQuestionario: async (req: Request, res: Response) => {
        try {
            const questionario = await CaratService.desativarQuestionario(Number(req.params.id));
            res.json(questionario);
        } catch (err: any) {
            res.status(400).json({ erro: err.message });
        }
    },

    // POST /carat/questoes
    // RF24 — Criar questão (Administrador)
    criarQuestao: async (req: Request, res: Response) => {
        const { id_questionario, texto_questao } = req.body;
        if (!id_questionario) return res.status(400).json({ erro: 'id_questionario é obrigatório.' });
        if (!texto_questao) return res.status(400).json({ erro: 'texto_questao é obrigatório.' });

        try {
            const questao = await CaratService.criarQuestao({ id_questionario, texto_questao });
            res.status(201).json(questao);
        } catch (err: any) {
            res.status(400).json({ erro: err.message });
        }
    },

    // POST /carat/opcoes-resposta
    // RF24 — Criar opção de resposta (Administrador)
    criarOpcaoResposta: async (req: Request, res: Response) => {
        const { id_questao, texto_opcao, score } = req.body;
        if (!id_questao) return res.status(400).json({ erro: 'id_questao é obrigatório.' });
        if (!texto_opcao) return res.status(400).json({ erro: 'texto_opcao é obrigatório.' });
        if (score === undefined || score === null) return res.status(400).json({ erro: 'score é obrigatório.' });

        try {
            const opcao = await CaratService.criarOpcaoResposta({ id_questao, texto_opcao, score });
            res.status(201).json(opcao);
        } catch (err: any) {
            res.status(400).json({ erro: err.message });
        }
    },
};