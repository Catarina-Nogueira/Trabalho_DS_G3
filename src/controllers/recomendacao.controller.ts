import { Request, Response } from 'express';
import { RecomendacaoService } from '../services/recomendacao.services';

export const RecomendacaoController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const recomendacoes = await RecomendacaoService.listarTodos();
            res.json(recomendacoes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar recomendações' });
        }
    },

    listarPorAvaliacao: async (req: Request, res: Response) => {
        try {
            const recomendacoes = await RecomendacaoService.listarPorAvaliacao(Number(req.params.id_avaliacao));
            res.json(recomendacoes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar recomendações da avaliação' });
        }
    },

    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const recomendacoes = await RecomendacaoService.listarPorUtente(Number(req.params.id_utente));
            res.json(recomendacoes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar recomendações do utente' });
        }
    },

    listarPorUtenteParaMedico: async (req: Request, res: Response) => {
        try {
            const recomendacoes = await RecomendacaoService.listarPorUtenteParaMedico(
                Number(req.params.id_utente),
                Number(req.params.id_medico)
            );
            res.json(recomendacoes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar recomendações do utente para o médico' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const recomendacao = await RecomendacaoService.buscarPorId(Number(req.params.id));
            if (!recomendacao) return res.status(404).json({ erro: 'Recomendação não encontrada' });
            res.json(recomendacao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar recomendação' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const recomendacao = await RecomendacaoService.criar(req.body);
            res.status(201).json(recomendacao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao criar recomendação' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const recomendacao = await RecomendacaoService.atualizar(Number(req.params.id), req.body);
            if (!recomendacao) return res.status(404).json({ erro: 'Recomendação não encontrada' });
            res.json(recomendacao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao atualizar recomendação' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await RecomendacaoService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar recomendação' });
        }
    }

};