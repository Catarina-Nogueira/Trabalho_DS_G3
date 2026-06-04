import { Request, Response } from 'express';
import { UtilizadorService } from '../services/utilizador.services';
import { Tipo_Utilizador } from '../models/utilizador.entity';
import { CriarUtilizadorDTO } from '../dtos/utilizador.dto';

export const UtilizadorController = {
    
    listarTodos: async (req: Request, res: Response) => {
        try {
            const utilizadores = await UtilizadorService.listarTodos();
            return res.json(utilizadores);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar utilizadores' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const utilizador = await UtilizadorService.buscarPorId(Number(req.params.id));
            if (!utilizador) return res.status(404).json({ erro: 'Utilizador não encontrado' });
            return res.json(utilizador);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao buscar utilizador' });
        }
    },

    criar: async (req: Request, res: Response) => {
        const id_utilizador_logado = req.user!.id; // 🔑 Administrador autenticado
        const { username, email, password, tipo_utilizador } = req.body;
 
        if (!username) return res.status(400).json({ erro: 'O username é obrigatório.' });
        if (!email) return res.status(400).json({ erro: 'O email é obrigatório.' });
        if (!password) return res.status(400).json({ erro: 'A password é obrigatória.' });
        if (!tipo_utilizador) return res.status(400).json({ erro: 'O tipo_utilizador é obrigatório.' });
 
        const tiposValidos = Object.values(Tipo_Utilizador);
        if (!tiposValidos.includes(tipo_utilizador.toLowerCase() as Tipo_Utilizador)) {
            return res.status(400).json({
                erro: `tipo_utilizador inválido. Valores aceites: ${tiposValidos.join(', ')}.`,
            });
        }
 
        try {
            const dadosDTO: CriarUtilizadorDTO = { username, email, password, tipo_utilizador };
            // 🚨 Correção: Passagem do executor adicionada
            const utilizador = await UtilizadorService.criar(dadosDTO, id_utilizador_logado);
            return res.status(201).json(utilizador);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const dados = req.body;
            
            const utilizadorSessao = req.user;
            if (!utilizadorSessao) {
                return res.status(401).json({ erro: 'Utilizador não autenticado na sessão.' });
            }

            const utilizador = await UtilizadorService.atualizar(id, dados, utilizadorSessao);
            if (!utilizador) return res.status(404).json({ erro: 'Utilizador não encontrado' });
            return res.json(utilizador);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    },

    desativar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            
            const utilizadorSessao = req.user;
            if (!utilizadorSessao) {
                return res.status(401).json({ erro: 'Utilizador não autenticado na sessão.' });
            }

            const utilizador = await UtilizadorService.desativar(id, utilizadorSessao);
            if (!utilizador) return res.status(404).json({ erro: 'Utilizador não encontrado.' });
            return res.json(utilizador);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            
            const utilizadorSessao = req.user;
            if (!utilizadorSessao) {
                return res.status(401).json({ erro: 'Utilizador não autenticado na sessão.' });
            }

            await UtilizadorService.eliminar(id, utilizadorSessao);
            return res.status(204).send();
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    }
};