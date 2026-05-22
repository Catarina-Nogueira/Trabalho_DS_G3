import { Request, Response } from 'express';
import { RespostaUtenteService } from '../services/respostaUtente.services';

export const RespostaUtenteController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const respostas = await RespostaUtenteService.listarTodos();
            res.json(respostas);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar respostas' });
        }
    },

    listarPorAvaliacao: async (req: Request, res: Response) => {
        try {
            const respostas = await RespostaUtenteService.listarPorAvaliacao(Number(req.params.id_avaliacao));
            res.json(respostas);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar respostas da avaliação' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const resposta = await RespostaUtenteService.buscarPorId(Number(req.params.id));
            if (!resposta) return res.status(404).json({ erro: 'Resposta não encontrada' });
            res.json(resposta);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar resposta' });
        }
    },

    // RF17 - Submissão de respostas CARAT
    submeterRespostas: async (req: Request, res: Response) => {
        try {
            const { id_avaliacao, ids_opcoes } = req.body;
            if (!id_avaliacao || !ids_opcoes || !Array.isArray(ids_opcoes)) {
                return res.status(400).json({ erro: 'id_avaliacao e ids_opcoes são obrigatórios' });
            }
            const respostas = await RespostaUtenteService.submeterRespostas(id_avaliacao, ids_opcoes);
            res.status(201).json(respostas);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao submeter respostas' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const resposta = await RespostaUtenteService.criar(req.body);
            res.status(201).json(resposta);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao criar resposta' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await RespostaUtenteService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar resposta' });
        }
    },

    eliminarPorAvaliacao: async (req: Request, res: Response) => {
        try {
            await RespostaUtenteService.eliminarPorAvaliacao(Number(req.params.id_avaliacao));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar respostas da avaliação' });
        }
    }

};