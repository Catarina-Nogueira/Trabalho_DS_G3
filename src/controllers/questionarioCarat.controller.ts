import { Request, Response } from 'express';
import { QuestionarioCaratService } from '../services/questionarioCarat.services';

export const QuestionarioCaratController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const questionarios = await QuestionarioCaratService.listarTodos();
            res.json(questionarios);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar questionários' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const questionario = await QuestionarioCaratService.buscarPorId(Number(req.params.id));
            if (!questionario) return res.status(404).json({ erro: 'Questionário não encontrado' });
            res.json(questionario);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar questionário' });
        }
    },

    // RF16 - Obter questionário ativo completo (questões + opções)
    obterAtivo: async (req: Request, res: Response) => {
        try {
            const questionario = await QuestionarioCaratService.obterAtivo();
            if (!questionario) return res.status(404).json({ erro: 'Nenhum questionário ativo encontrado' });
            res.json(questionario);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao obter questionário ativo' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const questionario = await QuestionarioCaratService.criar(req.body);
            res.status(201).json(questionario);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao criar questionário' });
        }
    },

    // RF24 - Ativar questionário
    ativar: async (req: Request, res: Response) => {
        try {
            const questionario = await QuestionarioCaratService.ativar(Number(req.params.id));
            if (!questionario) return res.status(404).json({ erro: 'Questionário não encontrado' });
            res.json(questionario);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao ativar questionário' });
        }
    },

    // RF24 - Desativar questionário
    desativar: async (req: Request, res: Response) => {
        try {
            const questionario = await QuestionarioCaratService.desativar(Number(req.params.id));
            if (!questionario) return res.status(404).json({ erro: 'Questionário não encontrado' });
            res.json(questionario);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao desativar questionário' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await QuestionarioCaratService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar questionário' });
        }
    }

};