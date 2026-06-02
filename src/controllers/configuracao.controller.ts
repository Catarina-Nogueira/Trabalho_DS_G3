import { Request, Response } from 'express';
import { ConfiguracaoService } from '../services/configuracao.services';
import { CriarConfiguracaoDTO, AtualizarConfiguracaoDTO } from '../dtos/configuracao.dto';

export const ConfiguracaoController = {

    listarTodas: async (req: Request, res: Response) => {
        try {
            const configs = await ConfiguracaoService.listarTodas();
            return res.json(configs);
        } catch (err: any) {
            return res.status(500).json({ erro: 'Erro ao listar parâmetros de configuração.' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const config = await ConfiguracaoService.buscarPorId(Number(req.params.id));
            if (!config) return res.status(404).json({ erro: 'Configuração não encontrada.' });
            return res.json(config);
        } catch (err: any) {
            return res.status(500).json({ erro: 'Erro ao buscar configuração.' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const { nome_parametro, valor_limiar, descricao } = req.body;
            const id_utilizador_sessao = req.user?.id; // Capturado do middleware de sessão

            if (!nome_parametro) return res.status(400).json({ erro: 'O campo nome_parametro é obrigatório.' });
            if (valor_limiar === undefined) return res.status(400).json({ erro: 'O campo valor_limiar é obrigatório.' });
            if (!descricao) return res.status(400).json({ erro: 'O campo descricao é obrigatório.' });
            if (!id_utilizador_sessao) return res.status(401).json({ erro: 'Sessão inválida ou utilizador não identificado.' });

            const dadosDTO: CriarConfiguracaoDTO = { nome_parametro, valor_limiar: Number(valor_limiar), descricao };
            const novaConfig = await ConfiguracaoService.criar(dadosDTO, id_utilizador_sessao);
            
            return res.status(201).json(novaConfig);
        } catch (err: any) {
            const status = err.message.includes('já existe') ? 409 : 400;
            return res.status(status).json({ erro: err.message });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const { valor_limiar, descricao } = req.body;
            const id_utilizador_sessao = req.user?.id;

            if (!id_utilizador_sessao) return res.status(401).json({ erro: 'Sessão inválida ou utilizador não identificado.' });

            const dadosDTO: AtualizarConfiguracaoDTO = { 
                valor_limiar: valor_limiar !== undefined ? Number(valor_limiar) : undefined, 
                descricao 
            };

            const configAtualizada = await ConfiguracaoService.atualizar(id, dadosDTO, id_utilizador_sessao);
            if (!configAtualizada) return res.status(404).json({ erro: 'Parâmetro de configuração não encontrado.' });
            
            return res.json(configAtualizada);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    }
};