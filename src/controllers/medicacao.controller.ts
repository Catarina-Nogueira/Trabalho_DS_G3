import { Request, Response } from 'express';
import { MedicacaoService } from '../services/medicacao.services';

export const MedicacaoController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const medicacoes = await MedicacaoService.listarTodos();
            res.json(medicacoes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar medicamentos' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const medicacao = await MedicacaoService.buscarPorId(Number(req.params.id));
            if (!medicacao) return res.status(404).json({ erro: 'Medicamento não encontrado' });
            res.json(medicacao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar medicamento' });
        }
    },

    buscarPorNome: async (req: Request, res: Response) => {
        try {
            const nome_medicamento = req.params.nome_medicamento as string;
            const medicacao = await MedicacaoService.buscarPorNome(nome_medicamento);
            if (!medicacao) return res.status(404).json({ erro: 'Medicamento não encontrado' });
            res.json(medicacao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar medicamento por nome' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const medicacao = await MedicacaoService.criar(req.body);
            res.status(201).json(medicacao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao criar medicamento' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const medicacao = await MedicacaoService.atualizar(Number(req.params.id), req.body);
            if (!medicacao) return res.status(404).json({ erro: 'Medicamento não encontrado' });
            res.json(medicacao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao atualizar medicamento' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await MedicacaoService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar medicamento' });
        }
    }
};