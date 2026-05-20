import { Request, Response } from 'express';
import { ExameUtenteService } from '../services/exameUtente.services';

export const ExameUtenteController = {

    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const exames = await ExameUtenteService.listarPorUtente(Number(req.params.id_utente));
            res.json(exames);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar exames do utente' });
        }
    },

    listarPendentesPorUtente: async (req: Request, res: Response) => {
        try {
            const exames = await ExameUtenteService.listarPendentesPorUtente(Number(req.params.id_utente));
            res.json(exames);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar exames pendentes do utente' });
        }
    },

    listarPorMedico: async (req: Request, res: Response) => {
        try {
            const exames = await ExameUtenteService.listarPorMedico(Number(req.params.id_medico));
            res.json(exames);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar exames do médico' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const exame = await ExameUtenteService.buscarPorId(Number(req.params.id));
            if (!exame) return res.status(404).json({ erro: 'Exame não encontrado' });
            res.json(exame);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar exame' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const exame = await ExameUtenteService.criar(req.body);
            res.status(201).json(exame);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao prescrever exame' });
        }
    },

    registarResultado: async (req: Request, res: Response) => {
        try {
            const { resultado, interpretacao } = req.body;
            const exame = await ExameUtenteService.registarResultado(
                Number(req.params.id),
                resultado,
                interpretacao
            );
            if (!exame) return res.status(404).json({ erro: 'Exame não encontrado' });
            res.json(exame);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao registar resultado do exame' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await ExameUtenteService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ erro: err.message });
            }
            res.status(500).json({ erro: 'Erro ao eliminar exame' });
        }
    }
};