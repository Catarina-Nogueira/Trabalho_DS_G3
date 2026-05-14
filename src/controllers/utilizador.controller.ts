import { Request, Response } from 'express'; //Pedido e resposta http
import { UtilizadorService } from '../services/utilizador.services';

export const UtilizadorController = {
    //cada método corresponde a uma operação CRUD
    listarTodos: async (req: Request, res: Response) => {
        try {
            const utilizadores = await UtilizadorService.listarTodos();
            res.json(utilizadores);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar utilizadores' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const utilizador = await UtilizadorService.buscarPorId(Number(req.params.id));
            if (!utilizador) return res.status(404).json({ erro: 'Utilizador não encontrado' });
            res.json(utilizador);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar utilizador' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const utilizador = await UtilizadorService.criar(req.body);
            res.status(201).json(utilizador);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao criar utilizador' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const utilizador = await UtilizadorService.atualizar(Number(req.params.id), req.body);
            if (!utilizador) return res.status(404).json({ erro: 'Utilizador não encontrado' });
            res.json(utilizador);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao atualizar utilizador' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await UtilizadorService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar utilizador' });
        }
    }
};