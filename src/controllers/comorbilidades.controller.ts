import { Request, Response } from 'express';
import { ComorbilidadeService } from '../services/comorbilidades.service';

export const ComorbilidadeController = {

    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const comorbilidades = await ComorbilidadeService.listarPorUtente(Number(req.params.id_utente));
            res.json(comorbilidades);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar comorbilidades do utente' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const comorbilidade = await ComorbilidadeService.buscarPorId(Number(req.params.id));
            if (!comorbilidade) return res.status(404).json({ erro: 'Comorbilidade não encontrada' });
            res.json(comorbilidade);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar comorbilidade' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const comorbilidade = await ComorbilidadeService.criar(req.body);
            res.status(201).json(comorbilidade);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao criar comorbilidade' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const comorbilidade = await ComorbilidadeService.atualizar(Number(req.params.id), req.body);
            if (!comorbilidade) return res.status(404).json({ erro: 'Comorbilidade não encontrada' });
            res.json(comorbilidade);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao atualizar comorbilidade' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await ComorbilidadeService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar comorbilidade' });
        }
    }
};