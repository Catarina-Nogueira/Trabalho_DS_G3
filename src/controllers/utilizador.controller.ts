import { Request, Response } from 'express'; // Pedido e resposta http
import { UtilizadorService } from '../services/utilizador.services';
import { Tipo_Utilizador } from '../models/utilizador.entity';
import { CriarUtilizadorDTO } from '../dtos/utilizador.dto';

export const UtilizadorController = {
    
    // GET /utilizadores
    listarTodos: async (req: Request, res: Response) => {
        try {
            const utilizadores = await UtilizadorService.listarTodos();
            return res.json(utilizadores);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar utilizadores' });
        }
    },

    // GET /utilizadores/:id
    buscarPorId: async (req: Request, res: Response) => {
        try {
            const utilizador = await UtilizadorService.buscarPorId(Number(req.params.id));
            if (!utilizador) return res.status(404).json({ erro: 'Utilizador não encontrado' });
            return res.json(utilizador);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao buscar utilizador' });
        }
    },

    // POST /utilizadores
    criar: async (req: Request, res: Response) => {
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
            const utilizador = await UtilizadorService.criar(dadosDTO);
            return res.status(201).json(utilizador);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    },

    // PUT /utilizadores/:id
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

    // PUT /utilizadores/:id/desativar
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