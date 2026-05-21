import { Request, Response } from 'express';
import { PlanoAcompanhamentoService } from '../services/planoAcompanhamento.services';

export const PlanoAcompanhamentoController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const planos = await PlanoAcompanhamentoService.listarTodos();
            res.json(planos);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar planos de acompanhamento' });
        }
    },

    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const planos = await PlanoAcompanhamentoService.listarPorUtente(Number(req.params.id_utente));
            res.json(planos);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar planos de acompanhamento do utente' });
        }
    },

    listarPorMedico: async (req: Request, res: Response) => {
        try {
            const planos = await PlanoAcompanhamentoService.listarPorMedico(Number(req.params.id_medico));
            res.json(planos);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar planos de acompanhamento do médico' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const plano = await PlanoAcompanhamentoService.buscarPorId(Number(req.params.id));
            if (!plano) return res.status(404).json({ erro: 'Plano de acompanhamento não encontrado' });
            res.json(plano);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar plano de acompanhamento' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const plano = await PlanoAcompanhamentoService.criar(req.body);
            res.status(201).json(plano);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao criar plano de acompanhamento' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const plano = await PlanoAcompanhamentoService.atualizar(Number(req.params.id), req.body);
            if (!plano) return res.status(404).json({ erro: 'Plano de acompanhamento não encontrado' });
            res.json(plano);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao atualizar plano de acompanhamento' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await PlanoAcompanhamentoService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar plano de acompanhamento' });
        }
    }

};