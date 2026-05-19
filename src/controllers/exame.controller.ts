import { Request, Response } from 'express';
import { ExameService } from '../services/exame.services';

export const ExameController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const exames = await ExameService.listarTodos();
            res.json(exames);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar exames' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const exame = await ExameService.buscarPorId(Number(req.params.id));
            if (!exame) return res.status(404).json({ erro: 'Exame não encontrado' });
            res.json(exame);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar exame' });
        }
    },

    buscarPorNome: async (req: Request, res: Response) => {
        try {
            const nome_exame = req.params.nome_exame as string;
            const exame = await ExameService.buscarPorNome(nome_exame);
            if (!exame) return res.status(404).json({ erro: 'Exame não encontrado' });
            res.json(exame);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar exame por nome' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const exame = await ExameService.criar(req.body);
            res.status(201).json(exame);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao criar exame' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const exame = await ExameService.atualizar(Number(req.params.id), req.body);
            if (!exame) return res.status(404).json({ erro: 'Exame não encontrado' });
            res.json(exame);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao atualizar exame' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await ExameService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar exame' });
        }
    }
};