import { Request, Response } from 'express';
import { OpcaoRespostaService } from '../services/opcaoResposta.services';

export const OpcaoRespostaController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const opcoes = await OpcaoRespostaService.listarTodos();
            res.json(opcoes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar opções de resposta' });
        }
    },

    listarPorQuestao: async (req: Request, res: Response) => {
        try {
            const opcoes = await OpcaoRespostaService.listarPorQuestao(Number(req.params.id_questao));
            res.json(opcoes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar opções de resposta da questão' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const opcao = await OpcaoRespostaService.buscarPorId(Number(req.params.id));
            if (!opcao) return res.status(404).json({ erro: 'Opção de resposta não encontrada' });
            res.json(opcao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar opção de resposta' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const opcao = await OpcaoRespostaService.criar(req.body);
            res.status(201).json(opcao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao criar opção de resposta' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const opcao = await OpcaoRespostaService.atualizar(Number(req.params.id), req.body);
            if (!opcao) return res.status(404).json({ erro: 'Opção de resposta não encontrada' });
            res.json(opcao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao atualizar opção de resposta' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await OpcaoRespostaService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar opção de resposta' });
        }
    }

};