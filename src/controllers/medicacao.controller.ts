import { Request, Response } from 'express';
import { MedicacaoService } from '../services/medicacao.services';

export const MedicacaoController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const medicacoes = await MedicacaoService.listarTodos();
            return res.json(medicacoes);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao listar medicamentos.' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const medicacao = await MedicacaoService.buscarPorId(Number(req.params.id));
            if (!medicacao) return res.status(404).json({ erro: 'Medicamento não encontrado.' });
            return res.json(medicacao);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao buscar medicamento.' });
        }
    },

    buscarPorNome: async (req: Request, res: Response) => {
        try {
            const nome_medicamento = req.params.nome_medicamento as string;
            const resultados = await MedicacaoService.buscarPorNome(nome_medicamento);
            
            if (!resultados || resultados.length === 0) {
                return res.status(404).json({ erro: 'Nenhum medicamento encontrado com esse nome.' });
            }
            return res.json(resultados);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao buscar medicamento por nome.' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const idUtilizadorLogado = req.user!.id; // Pega o admin da sessão
            const medicacao = await MedicacaoService.criar(req.body, idUtilizadorLogado);
            return res.status(201).json(medicacao);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message || 'Erro ao criar medicamento.' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const idUtilizadorLogado = req.user!.id;
            const medicacao = await MedicacaoService.atualizar(Number(req.params.id), req.body, idUtilizadorLogado);
            if (!medicacao) return res.status(404).json({ erro: 'Medicamento não encontrado.' });
            return res.json(medicacao);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message || 'Erro ao atualizar medicamento.' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            const idUtilizadorLogado = req.user!.id;
            const sucesso = await MedicacaoService.eliminar(Number(req.params.id), idUtilizadorLogado);
            
            if (!sucesso) return res.status(404).json({ erro: 'Medicamento não encontrado para eliminação.' });
            return res.status(204).send();
        } catch (err: any) {
            return res.status(400).json({ erro: err.message || 'Erro ao eliminar medicamento.' });
        }
    }
};