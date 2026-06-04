import { Request, Response } from 'express';
import { MedicacaoUtenteService } from '../services/medicacaoUtente.services';

export const MedicacaoUtenteController = {

    // GET /medicacao-utente/utente/:id_utente
    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const utilizadorLogado = req.user!;
            const id_utente = Number(req.params.id_utente);

            if (!id_utente) return res.status(400).json({ erro: 'O parâmetro id_utente na URL é obrigatório.' });

            // BARREIRA DE SEGURANÇA: Validar acessos cruzados
            const { AppDataSource } = require('../database/database');
            const { Utente } = require('../models/utente.entity');
            const utenteRepo = AppDataSource.getRepository(Utente);

            if (utilizadorLogado.tipo_utilizador === 'utente') {
                const utenteDados = await utenteRepo.findOne({ where: { utilizador: { id: utilizadorLogado.id } } });
                if (!utenteDados || utenteDados.id !== id_utente) {
                    return res.status(403).json({ erro: 'Acesso negado. Não pode consultar medicações de outros utentes.' });
                }
            } else if (utilizadorLogado.tipo_utilizador === 'medico') {
                const utenteAlvo = await utenteRepo.findOne({ where: { id: id_utente }, relations: ['medico'] });
                if (!utenteAlvo) return res.status(404).json({ erro: 'Utente não encontrado.' });
                if (!utenteAlvo.medico || utenteAlvo.medico.id !== utilizadorLogado.id) {
                    return res.status(403).json({ erro: 'Acesso negado. Apenas o médico responsável pode consultar esta ficha clínica.' });
                }
            }

            const medicacoes = await MedicacaoUtenteService.listarPorUtente(id_utente);
            return res.json(medicacoes);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar prescrições do utente' });
        }
    },

    // GET /medicacao-utente/utente/:id_utente/ativas
    listarAtivasPorUtente: async (req: Request, res: Response) => {
        try {
            const utilizadorLogado = req.user!;
            const id_utente = Number(req.params.id_utente);

            if (!id_utente) return res.status(400).json({ erro: 'O parâmetro id_utente na URL é obrigatório.' });

            // BARREIRA DE SEGURANÇA: Validar acessos cruzados
            const { AppDataSource } = require('../database/database');
            const { Utente } = require('../models/utente.entity');
            const utenteRepo = AppDataSource.getRepository(Utente);

            if (utilizadorLogado.tipo_utilizador === 'utente') {
                const utenteDados = await utenteRepo.findOne({ where: { utilizador: { id: utilizadorLogado.id } } });
                if (!utenteDados || utenteDados.id !== id_utente) {
                    return res.status(403).json({ erro: 'Acesso negado. Não pode consultar medicações de outros utentes.' });
                }
            } else if (utilizadorLogado.tipo_utilizador === 'medico') {
                const utenteAlvo = await utenteRepo.findOne({ where: { id: id_utente }, relations: ['medico'] });
                if (!utenteAlvo) return res.status(404).json({ erro: 'Utente não encontrado.' });
                if (!utenteAlvo.medico || utenteAlvo.medico.id !== utilizadorLogado.id) {
                    return res.status(403).json({ erro: 'Acesso negado. Apenas o médico responsável pode consultar esta ficha clínica.' });
                }
            }

            const medicacoes = await MedicacaoUtenteService.listarAtivasPorUtente(id_utente);
            return res.json(medicacoes);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar prescrições ativas' });
        }
    },

    // GET /medicacao-utente/requisitados
    listarPorMedico: async (req: Request, res: Response) => {
        try {
            const id_medico = req.user!.id; 
            const medicacoes = await MedicacaoUtenteService.listarPorMedico(id_medico);
            return res.json(medicacoes);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar prescrições do médico' });
        }
    },

    // POST /medicacao-utente/utente/:id_utente
    criar: async (req: Request, res: Response) => {
        try {
            const id_medico_logado = req.user!.id; 
            const id_utente_alvo = Number(req.params.id_utente); 
            const { id_medicacao, frequencia, data_inicio, duracao, dosagem } = req.body;

            if (!id_utente_alvo) {
                return res.status(400).json({ erro: 'O parâmetro id_utente na URL é obrigatório.' });
            }
            if (!id_medicacao) {
                return res.status(400).json({ erro: 'O campo id_medicacao no corpo do pedido é obrigatório.' });
            }

            const { AppDataSource } = require('../database/database');
            const { Utente } = require('../models/utente.entity');
            const utenteRepo = AppDataSource.getRepository(Utente);

            const utenteAlvo = await utenteRepo.findOne({
                where: { id: id_utente_alvo },
                relations: ['medico']
            });

            if (!utenteAlvo) {
                return res.status(404).json({ erro: 'Utente não encontrado no sistema.' });
            }

            if (!utenteAlvo.medico || utenteAlvo.medico.id !== id_medico_logado) {
                return res.status(403).json({ 
                    erro: 'Acesso negado. Apenas o médico responsável por este utente pode emitir novas prescrições.' 
                });
            }

            // 
            const novaPrescricao = await MedicacaoUtenteService.criar({
                utente: { id: id_utente_alvo },
                medico: { id: id_medico_logado },
                medicacao: { id: Number(id_medicacao) },
                frequencia,
                data_inicio,
                duracao,
                dosagem
            }, id_medico_logado);

            return res.status(201).json(novaPrescricao);
        } catch (err: any) {
            return res.status(500).json({ erro: 'Erro ao criar prescrição médica.' });
        }
    },

    // PATCH /medicacao-utente/:id
    atualizar: async (req: Request, res: Response) => {
        try {
            const id_medico_logado = req.user!.id;
            const id_prescricao = Number(req.params.id);
            const prescricaoOriginal = await MedicacaoUtenteService.buscarPorId(id_prescricao);
            
            if (!prescricaoOriginal) return res.status(404).json({ erro: 'Prescrição não encontrada' });
            if (prescricaoOriginal.medico.id !== id_medico_logado) {
                return res.status(403).json({ erro: 'Apenas o médico que prescreveu pode alterar estes dados.' });
            }

           
            const atualizada = await MedicacaoUtenteService.atualizar(id_prescricao, req.body, id_medico_logado);
            return res.json(atualizada);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao atualizar prescrição' });
        }
    },

    // PATCH /medicacao-utente/:id/encerrar
    encerrar: async (req: Request, res: Response) => {
        try {
            const id_medico_logado = req.user!.id;
            const id_prescricao = Number(req.params.id);
            const prescricaoOriginal = await MedicacaoUtenteService.buscarPorId(id_prescricao);

            if (!prescricaoOriginal) return res.status(404).json({ erro: 'Prescrição não encontrada' });
            if (prescricaoOriginal.medico.id !== id_medico_logado) {
                return res.status(403).json({ erro: 'Apenas o médico responsável pode encerrar esta prescrição.' });
            }

            
            const encerrada = await MedicacaoUtenteService.encerrar(id_prescricao, id_medico_logado);
            return res.json(encerrada);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao encerrar prescrição' });
        }
    }
};