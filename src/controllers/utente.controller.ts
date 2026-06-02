import { Request, Response } from 'express';
import { UtenteService } from '../services/utente.services';
import { CriarUtenteDTO } from '../dtos/utente.dto';

export const UtenteController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const utentes = await UtenteService.listarTodos();
            return res.json(utentes);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar utentes.' });
        }
    },

    listarPorMedico: async (req: Request, res: Response) => {
        try {
            const utentes = await UtenteService.listarPorMedico(Number(req.params.id_medico));
            return res.json(utentes);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar utentes do médico.' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const utente = await UtenteService.buscarPorId(Number(req.params.id));
            if (!utente) return res.status(404).json({ erro: 'Utente não encontrado.' });
            return res.json(utente);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao buscar utente.' });
        }
    },

    buscarDadosPermitidos: async (req: Request, res: Response) => {
        try {
            const utente = await UtenteService.buscarDadosPermitidos(Number(req.params.id));
            if (!utente) return res.status(404).json({ erro: 'Utente não encontrado.' });
            return res.json(utente);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao buscar dados do utente.' });
        }
    },

    // POST /utentes/utilizador/:id_utilizador
    criar: async (req: Request, res: Response) => {
        try {
            const id_utilizador = Number(req.params.id_utilizador);
            const { nome, data_nascimento, sexo_biologico, id_medico } = req.body;

            if (!id_utilizador) return res.status(400).json({ erro: 'O parâmetro id_utilizador na URL é obrigatório.' });
            if (!nome) return res.status(400).json({ erro: 'O campo nome é obrigatório.' });
            if (!data_nascimento) return res.status(400).json({ erro: 'O campo data_nascimento é obrigatório.' });
            if (!sexo_biologico) return res.status(400).json({ erro: 'O campo sexo_biologico é obrigatório.' });
            if (!id_medico) return res.status(400).json({ erro: 'O campo id_medico é obrigatório.' });

            const dadosDTO: CriarUtenteDTO = { nome, data_nascimento, sexo_biologico };

            const utente = await UtenteService.criar(dadosDTO, id_utilizador, Number(id_medico));
            return res.status(201).json(utente);
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
             
            const utente = await UtenteService.atualizar(id, dados, utilizadorSessao);
            if (!utente) return res.status(404).json({ erro: 'Utente não encontrado.' });
            return res.json(utente);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await UtenteService.eliminar(Number(req.params.id));
            return res.status(204).send();
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    },
};