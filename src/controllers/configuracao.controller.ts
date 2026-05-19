import { Request, Response } from 'express';
import { ConfiguracaoService } from '../services/configuracao.services';

export const ConfiguracaoController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const configuracoes = await ConfiguracaoService.listarTodos();
            res.json(configuracoes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar configurações' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const configuracao = await ConfiguracaoService.buscarPorId(Number(req.params.id));
            if (!configuracao) return res.status(404).json({ erro: 'Configuração não encontrada' });
            res.json(configuracao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar configuração' });
        }
    },

    buscarPorNome: async (req: Request, res: Response) => {
        try {
            const nome_parametro = req.params.nome_parametro as string;
            const configuracao = await ConfiguracaoService.buscarPorNome(nome_parametro);
            if (!configuracao) return res.status(404).json({ erro: 'Parâmetro não encontrado' });
            res.json(configuracao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar parâmetro' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const configuracao = await ConfiguracaoService.criar(req.body);
            res.status(201).json(configuracao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao criar configuração' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const configuracao = await ConfiguracaoService.atualizar(Number(req.params.id), req.body);
            if (!configuracao) return res.status(404).json({ erro: 'Configuração não encontrada' });
            res.json(configuracao);
        } catch (err) {
            // RF13 - Devolve o erro de validação com 400 em vez de 500
            if (err instanceof Error) {
                return res.status(400).json({ erro: err.message });
            }
            res.status(500).json({ erro: 'Erro ao atualizar configuração' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await ConfiguracaoService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar configuração' });
        }
    }
};