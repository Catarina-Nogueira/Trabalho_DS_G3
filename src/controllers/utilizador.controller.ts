import { Request, Response } from 'express'; //Pedido e resposta http
import { UtilizadorService } from '../services/utilizador.services';
import { Tipo_Utilizador } from '../models/utilizador.entity';

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
        const { username, email, password, tipo_utilizador } = req.body;
 
        // Validações de entrada
        if (!username) return res.status(400).json({ erro: 'username é obrigatório.' });
        if (!email) return res.status(400).json({ erro: 'email é obrigatório.' });
        if (!password) return res.status(400).json({ erro: 'password é obrigatória.' });
        if (!tipo_utilizador) return res.status(400).json({ erro: 'tipo_utilizador é obrigatório.' });
 
        // Verificar que o tipo é válido
        const tiposValidos = Object.values(Tipo_Utilizador);
        if (!tiposValidos.includes(tipo_utilizador)) {
            return res.status(400).json({
                erro: `tipo_utilizador inválido. Valores aceites: ${tiposValidos.join(', ')}.`,
            });
        }
 
        try {
            const utilizador = await UtilizadorService.criar({ username, email, password, tipo_utilizador });
            res.status(201).json(utilizador);
        } catch (err: any) {
            res.status(400).json({ erro: err.message });
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

    desativar: async (req: Request, res: Response) => {
        try {
            const utilizador = await UtilizadorService.desativar(Number(req.params.id));
            if (!utilizador) return res.status(404).json({ erro: 'Utilizador não encontrado.' });
            res.json(utilizador);
        } catch (err: any) {
            res.status(400).json({ erro: err.message });
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