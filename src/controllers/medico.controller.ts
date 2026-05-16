import { Request, Response } from 'express';
import { MedicoService } from '../services/medico.services';

export const MedicoController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const medicos = await MedicoService.listarTodos();
            res.json(medicos);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar médicos' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const medico = await MedicoService.buscarPorId(Number(req.params.id));
            if (!medico) return res.status(404).json({ erro: 'Médico não encontrado' });
            res.json(medico);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar médico' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const medico = await MedicoService.criar(req.body);
            res.status(201).json(medico);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao criar médico' });
        }
    },

    atualizarTelemovel: async (req: Request, res: Response) => {
        try {
            const { telemovel } = req.body;
            if (!telemovel) return res.status(400).json({ erro: 'Telemóvel obrigatório' });
            
            const medico = await MedicoService.atualizarTelemovel(Number(req.params.id), telemovel);
            if (!medico) return res.status(404).json({ erro: 'Médico não encontrado' });
            res.json(medico);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao atualizar telemóvel' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await MedicoService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar médico' });
        }
    }
};