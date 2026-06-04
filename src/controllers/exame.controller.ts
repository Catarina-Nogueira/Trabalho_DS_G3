import { Request, Response } from 'express';
import { ExameService } from '../services/exame.services';
import { CriarExameDTO, AtualizarExameDTO } from '../dtos/exame.dto';

export const ExameController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const exames = await ExameService.listarTodos();
            return res.json(exames);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao listar exames' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ erro: 'ID do exame inválido.' });
            }

            const exame = await ExameService.buscarPorId(id);
            if (!exame) return res.status(404).json({ erro: 'Exame não encontrado' });
            return res.json(exame);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao buscar exame' });
        }
    },

    buscarPorNome: async (req: Request, res: Response) => {
        try {
            // Cast explícito para string resolve o erro de ambiguidade do Express
            const nome_exame = req.params.nome_exame as string;
            if (!nome_exame || nome_exame.trim() === '') {
                return res.status(400).json({ erro: 'O nome do exame é obrigatório.' });
            }

            const exame = await ExameService.buscarPorNome(nome_exame.trim());
            if (!exame) return res.status(404).json({ erro: 'Exame não encontrado' });
            return res.json(exame);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao buscar exame por nome' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const dados: CriarExameDTO = req.body;
            
            if (!dados.nome_exame || dados.nome_exame.trim() === '') return res.status(400).json({ erro: 'O nome do exame é obrigatório.' });
            if (!dados.descricao || dados.descricao.trim() === '') return res.status(400).json({ erro: 'A descrição do exame é obrigatória.' });
            if (!dados.tipo) return res.status(400).json({ erro: 'O tipo do exame é obrigatório.' });

            const exame = await ExameService.criar(dados);
            return res.status(201).json(exame);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao criar exame' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ erro: 'ID do exame inválido.' });
            }

            const dados: AtualizarExameDTO = req.body;
            
            // O Service consome o DTO diretamente de forma segura
            const exame = await ExameService.atualizar(id, dados);
            if (!exame) return res.status(404).json({ erro: 'Exame não encontrado' });
            
            return res.json(exame);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao atualizar exame' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ erro: 'ID do exame inválido.' });
            }

            await ExameService.eliminar(id);
            return res.status(204).send();
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao eliminar exame' });
        }
    }
};