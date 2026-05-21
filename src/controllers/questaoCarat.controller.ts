import { Request, Response } from 'express';
import { QuestaoCaratService } from '../services/questaoCarat.services';

export const QuestaoCaratController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const questoes = await QuestaoCaratService.listarTodos();
            res.json(questoes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar questões' });
        }
    },

    listarPorQuestionario: async (req: Request, res: Response) => {
        try {
            const questoes = await QuestaoCaratService.listarPorQuestionario(Number(req.params.id_questionario));
            res.json(questoes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar questões do questionário' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const questao = await QuestaoCaratService.buscarPorId(Number(req.params.id));
            if (!questao) return res.status(404).json({ erro: 'Questão não encontrada' });
            res.json(questao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar questão' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const questao = await QuestaoCaratService.criar(req.body);
            res.status(201).json(questao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao criar questão' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const questao = await QuestaoCaratService.atualizar(Number(req.params.id), req.body);
            if (!questao) return res.status(404).json({ erro: 'Questão não encontrada' });
            res.json(questao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao atualizar questão' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await QuestaoCaratService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar questão' });
        }
    }

};