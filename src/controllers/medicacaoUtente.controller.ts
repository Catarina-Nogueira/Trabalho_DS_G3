import { Request, Response } from 'express';
import { MedicacaoUtenteService } from '../services/medicacaoUtente.services';

export const MedicacaoUtenteController = {

    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const medicacoes = await MedicacaoUtenteService.listarPorUtente(Number(req.params.id_utente));
            res.json(medicacoes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar prescrições do utente' });
        }
    },

    listarAtivasPorUtente: async (req: Request, res: Response) => {
        try {
            const medicacoes = await MedicacaoUtenteService.listarAtivasPorUtente(Number(req.params.id_utente));
            res.json(medicacoes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar prescrições ativas do utente' });
        }
    },

    listarPorMedico: async (req: Request, res: Response) => {
        try {
            const medicacoes = await MedicacaoUtenteService.listarPorMedico(Number(req.params.id_medico));
            res.json(medicacoes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar prescrições do médico' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const medicacao = await MedicacaoUtenteService.buscarPorId(Number(req.params.id));
            if (!medicacao) return res.status(404).json({ erro: 'Prescrição não encontrada' });
            res.json(medicacao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar prescrição' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const medicacao = await MedicacaoUtenteService.criar(req.body);
            res.status(201).json(medicacao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao criar prescrição' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const medicacao = await MedicacaoUtenteService.atualizar(Number(req.params.id), req.body);
            if (!medicacao) return res.status(404).json({ erro: 'Prescrição não encontrada' });
            res.json(medicacao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao atualizar prescrição' });
        }
    },

    encerrar: async (req: Request, res: Response) => {
        try {
            const medicacao = await MedicacaoUtenteService.encerrar(Number(req.params.id));
            if (!medicacao) return res.status(404).json({ erro: 'Prescrição não encontrada' });
            res.json(medicacao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao encerrar prescrição' });
        }
    }
};