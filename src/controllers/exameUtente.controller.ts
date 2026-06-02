// src/controllers/exameUtente.controller.ts
import { Request, Response } from 'express';
import { ExameUtenteService } from '../services/exameUtente.services';

export const ExameUtenteController = {

    // RF48 - Listar todos os exames do utilizador (Utente ou Médico a ver a ficha)
    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const utilizadorLogado = req.user!;
            let id_utente: number;

            if (utilizadorLogado.tipo_utilizador === 'utente') {
                id_utente = utilizadorLogado.id;
            } else {
                id_utente = Number(req.query.id_utente);
                if (!id_utente) return res.status(400).json({ erro: 'ID do utente em falta.' });
            }

            const exames = await ExameUtenteService.listarPorUtente(id_utente);
            return res.json(exames);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar exames do utente' });
        }
    },

    // RF48 - Listar exames pendentes
    listarPendentesPorUtente: async (req: Request, res: Response) => {
        try {
            const utilizadorLogado = req.user!;
            let id_utente: number;

            if (utilizadorLogado.tipo_utilizador === 'utente') {
                id_utente = utilizadorLogado.id;
            } else {
                id_utente = Number(req.query.id_utente);
                if (!id_utente) return res.status(400).json({ erro: 'ID do utente em falta.' });
            }

            const exames = await ExameUtenteService.listarPendentesPorUtente(id_utente);
            return res.json(exames);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar exames pendentes' });
        }
    },

    // Listar todos os exames passados pelo Médico logado
    listarPorMedico: async (req: Request, res: Response) => {
        try {
            const id_medico = req.user!.id; 
            const exames = await ExameUtenteService.listarPorMedico(id_medico);
            return res.json(exames);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar exames do médico' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const exame = await ExameUtenteService.buscarPorId(Number(req.params.id));
            if (!exame) return res.status(404).json({ erro: 'Exame não encontrado' });

            // Validações de segurança por perfil
            if (req.user!.tipo_utilizador === 'utente' && exame.utente.id !== req.user!.id) {
                return res.status(403).json({ erro: 'Não tem permissão para consultar este exame.' });
            }
            if (req.user!.tipo_utilizador === 'medico' && exame.medico.id !== req.user!.id) {
                return res.status(403).json({ erro: 'Este exame foi requisitado por outro clínico.' });
            }

            return res.json(exame);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao buscar exame' });
        }
    },

    // RF46 - Prescrição de exame pelo médico
    criar: async (req: Request, res: Response) => {
        try {
            const id_medico = req.user!.id; // Injetado da sessão de forma blindada
            const { id_utente, id_exame, data_exame } = req.body;

            if (!id_utente || !id_exame || !data_exame) {
                return res.status(400).json({ erro: 'Campos obrigatórios em falta (id_utente, id_exame, data_exame).' });
            }

            const novoExame = await ExameUtenteService.criar({
                utente: { id: Number(id_utente) },
                medico: { id: id_medico },
                exame: { id: Number(id_exame) },
                data_exame
            });

            return res.status(201).json(novoExame);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao prescrever exame' });
        }
    },

    // RF47 - Registo de resultado de exame pelo médico
    registarResultado: async (req: Request, res: Response) => {
        try {
            const id_requisicao = Number(req.params.id);
            const exameOriginal = await ExameUtenteService.buscarPorId(id_requisicao);

            if (!exameOriginal) return res.status(404).json({ erro: 'Exame não encontrado' });
            if (exameOriginal.medico.id !== req.user!.id) {
                return res.status(403).json({ erro: 'Apenas o médico que prescreveu o exame pode registar resultados.' });
            }

            const { resultado, interpretacao } = req.body;
            if (!resultado || !interpretacao) {
                return res.status(400).json({ erro: 'Resultado e interpretação clínica são obrigatórios.' });
            }

            const exameAtualizado = await ExameUtenteService.registarResultado(id_requisicao, resultado, interpretacao);
            return res.json(exameAtualizado);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao registar resultado do exame' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            const id_requisicao = Number(req.params.id);
            const exameOriginal = await ExameUtenteService.buscarPorId(id_requisicao);

            if (!exameOriginal) return res.status(404).json({ erro: 'Exame não encontrado' });
            if (exameOriginal.medico.id !== req.user!.id) {
                return res.status(403).json({ erro: 'Apenas o médico que requisitou pode eliminar este exame.' });
            }

            await ExameUtenteService.eliminar(id_requisicao);
            return res.status(204).send();
        } catch (err: any) {
            return res.status(400).json({ erro: err.message || 'Erro ao eliminar exame' });
        }
    }
};