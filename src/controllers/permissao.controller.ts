import { Request, Response } from 'express';
import { PermissaoService } from '../services/permissao.services';

export const PermissaoController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const permissoes = await PermissaoService.listarTodos();
            res.json(permissoes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar permissões' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const permissao = await PermissaoService.buscarPorId(Number(req.params.id));
            if (!permissao) return res.status(404).json({ erro: 'Permissão não encontrada' });
            res.json(permissao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar permissão' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const permissao = await PermissaoService.criar(req.body);
            res.status(201).json(permissao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao criar permissão' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const permissao = await PermissaoService.atualizar(Number(req.params.id), req.body);
            if (!permissao) return res.status(404).json({ erro: 'Permissão não encontrada' });
            res.json(permissao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao atualizar permissão' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await PermissaoService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar permissão' });
        }
    }

};