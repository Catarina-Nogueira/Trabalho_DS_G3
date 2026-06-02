import { Request, Response } from 'express';
import { UtenteService } from '../services/utente.services';
import { Utilizador } from '../models/utilizador.entity';

export const UtenteController = {

    // RF51 — Listar todos os utentes (Administrador)
    listarTodos: async (req: Request, res: Response) => {
        try {
            const utentes = await UtenteService.listarTodos();
            res.json(utentes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar utentes.' });
        }
    },

    // GET /utentes/medico/:id_medico
    // RF51 — Listar utentes de um médico específico
    listarPorMedico: async (req: Request, res: Response) => {
        try {
            const utentes = await UtenteService.listarPorMedico(Number(req.params.id_medico));
            res.json(utentes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar utentes do médico.' });
        }
    },

    // GET /utentes/:id
    // RF50 — Detalhe completo do utente (médico/admin)
    buscarPorId: async (req: Request, res: Response) => {
        try {
            const utente = await UtenteService.buscarPorId(Number(req.params.id));
            if (!utente) return res.status(404).json({ erro: 'Utente não encontrado.' });
            res.json(utente);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar utente.' });
        }
    },

    // GET /utentes/:id/dados-permitidos
    // RF50, RF06 — Apenas dados clínicos (sem dados administrativos sensíveis)
    buscarDadosPermitidos: async (req: Request, res: Response) => {
        try {
            const utente = await UtenteService.buscarDadosPermitidos(Number(req.params.id));
            if (!utente) return res.status(404).json({ erro: 'Utente não encontrado.' });
            res.json(utente);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar dados do utente.' });
        }
    },

    // POST /utentes
    // RF07 — Criar utente (Administrador)
    // Body esperado: { nome, data_nascimento, sexo_biologico, id_utilizador, id_medico }
    criar: async (req: Request, res: Response) => {
        const { nome, data_nascimento, sexo_biologico, id_utilizador, id_medico } = req.body;

        // Validações de entrada
        if (!nome) return res.status(400).json({ erro: 'nome é obrigatório.' });
        if (!data_nascimento) return res.status(400).json({ erro: 'data_nascimento é obrigatória.' });
        if (!sexo_biologico) return res.status(400).json({ erro: 'sexo_biologico é obrigatório.' });
        if (!id_utilizador) return res.status(400).json({ erro: 'id_utilizador é obrigatório.' });
        if (!id_medico) return res.status(400).json({ erro: 'id_medico é obrigatório.' });

        try {
            const utente = await UtenteService.criar(
                { nome, data_nascimento, sexo_biologico },
                Number(id_utilizador),
                Number(id_medico),
            );
            res.status(201).json(utente);
        } catch (err: any) {
            res.status(400).json({ erro: err.message });
        }
    },

    // PUT /utentes/:id
    // RF05 — Atualizar dados pessoais permitidos (nome e/ou médico)
    atualizar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const dados = req.body;
            const utilizadorSessao = req.user;
            
            if (!utilizadorSessao) {
            return res.status(401).json({ erro: 'Utilizador não autenticado na sessão.' });
            }
             
            const utente = await UtenteService.atualizar(id, dados, utilizadorSessao);
            if (!utente) return res.status(404).json({ erro: 'Utente não encontrado.' });
            res.json(utente);
        } catch (err: any) {
            res.status(400).json({ erro: err.message });
        }
    },

    // DELETE /utentes/:id
    // RF08 — Eliminar utente (Administrador)
    eliminar: async (req: Request, res: Response) => {
        try {
            await UtenteService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err: any) {
            res.status(400).json({ erro: err.message });
        }
    },
};