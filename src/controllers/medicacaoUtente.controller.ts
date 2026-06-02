import { Request, Response } from 'express';
import { MedicacaoUtenteService } from '../services/medicacaoUtente.services';

export const MedicacaoUtenteController = {

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

            const medicacoes = await MedicacaoUtenteService.listarPorUtente(id_utente);
            return res.json(medicacoes);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar prescrições do utente' });
        }
    },

    listarAtivasPorUtente: async (req: Request, res: Response) => {
        try {
            const utilizadorLogado = req.user!;
            let id_utente: number;

            if (utilizadorLogado.tipo_utilizador === 'utente') {
                id_utente = utilizadorLogado.id;
            } else {
                id_utente = Number(req.query.id_utente);
                if (!id_utente) return res.status(400).json({ erro: 'ID do utente em falta.' });
            }

            const medicacoes = await MedicacaoUtenteService.listarAtivasPorUtente(id_utente);
            return res.json(medicacoes);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar prescrições ativas' });
        }
    },

    listarPorMedico: async (req: Request, res: Response) => {
        try {
            const id_medico = req.user!.id; // Injetado via token/sessão de forma segura
            const medicacoes = await MedicacaoUtenteService.listarPorMedico(id_medico);
            return res.json(medicacoes);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar prescrições do médico' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const id_medico = req.user!.id; // Garante que o médico não finge ser outro médico
            const { id_utente, id_medicacao, frequencia, data_inicio, duracao, dosagem } = req.body;

            if (!id_utente || !id_medicacao) {
                return res.status(400).json({ erro: 'Campos obrigatórios em falta (id_utente, id_medicacao).' });
            }

            const novaPrescricao = await MedicacaoUtenteService.criar({
                utente: { id: Number(id_utente) },
                medico: { id: id_medico },
                medicacao: { id: Number(id_medicacao) },
                frequencia,
                data_inicio,
                duracao,
                dosagem
            });

            return res.status(201).json(novaPrescricao);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao criar prescrição' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const id_prescricao = Number(req.params.id);
            const prescricaoOriginal = await MedicacaoUtenteService.buscarPorId(id_prescricao);
            
            if (!prescricaoOriginal) return res.status(404).json({ erro: 'Prescrição não encontrada' });
            if (prescricaoOriginal.medico.id !== req.user!.id) {
                return res.status(403).json({ erro: 'Apenas o médico que prescreveu pode alterar estes dados.' });
            }

            const atualizada = await MedicacaoUtenteService.atualizar(id_prescricao, req.body);
            return res.json(atualizada);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao atualizar prescrição' });
        }
    },

    encerrar: async (req: Request, res: Response) => {
        try {
            const id_prescricao = Number(req.params.id);
            const prescricaoOriginal = await MedicacaoUtenteService.buscarPorId(id_prescricao);

            if (!prescricaoOriginal) return res.status(404).json({ erro: 'Prescrição não encontrada' });
            if (prescricaoOriginal.medico.id !== req.user!.id) {
                return res.status(403).json({ erro: 'Apenas o médico responsável pode encerrar esta prescrição.' });
            }

            const encerrada = await MedicacaoUtenteService.encerrar(id_prescricao);
            return res.json(encerrada);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao encerrar prescrição' });
        }
    }
};