import { Request, Response } from 'express';
import { UtenteService } from '../services/utente.services';

export const UtenteController = {
    
    listarTodos: async (req: Request, res: Response) => {
        try {
            const utentes = await UtenteService.listarTodos();
            res.json(utentes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar utentes' });
        }
    },

    listarPorMedico: async (req: Request, res: Response) => {
        try {
            const utentes = await UtenteService.listarPorMedico(Number(req.params.id_medico));
            res.json(utentes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar utentes do médico' });
        }
    },
    
    buscarPorId: async (req: Request, res: Response) => {
        try {
            const utente = await UtenteService.buscarPorId(Number(req.params.id));
            if (!utente) return res.status(404).json({ erro: 'Utente não encontrado' });
            res.json(utente);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar utente' });
        }
    },

    buscarDadosPermitidos: async (req: Request, res: Response) => {
        try {
            const utente = await UtenteService.buscarDadosPermitidos(Number(req.params.id));
            if (!utente) return res.status(404).json({ erro: 'Utente não encontrado' });
            res.json(utente);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar dados do utente' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const utente = await UtenteService.criar(req.body);
            res.status(201).json(utente);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao criar utente' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const utente = await UtenteService.atualizar(Number(req.params.id), req.body);
            if (!utente) return res.status(404).json({ erro: 'Utente não encontrado' });
            res.json(utente);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao atualizar utente' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await UtenteService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar utente' });
        }
    }
};