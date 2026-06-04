import { Request, Response } from 'express';
import { HistoriaFamiliarService } from '../services/historiaFamiliar.services';
import { CriarHistoriaFamiliarDTO, AtualizarHistoriaFamiliarDTO } from '../dtos/historiaFamiliar.dto';

export const HistoriaFamiliarController = {

    // GET /historia-familiar/utente/:id_utente
    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const utilizadorLogado = req.user!;
            const idUtenteUrl = Number(req.params.id_utente);

            if (!idUtenteUrl) {
                return res.status(400).json({ erro: 'O parâmetro id_utente na URL é obrigatório.' });
            }

            const { AppDataSource } = require('../database/database');
            const { Utente } = require('../models/utente.entity');
            const utenteRepo = AppDataSource.getRepository(Utente);

            // --- 👤 BARREIRA DE SEGURANÇA PARA UTENTES ---
            if (utilizadorLogado.tipo_utilizador === 'utente') {
                const utenteDados = await utenteRepo.findOne({ 
                    where: { utilizador: { id: utilizadorLogado.id } } 
                });

                if (!utenteDados) {
                    return res.status(404).json({ erro: 'Perfil clínico de utente não encontrado.' });
                }

                if (utenteDados.id !== idUtenteUrl) {
                    return res.status(403).json({ erro: 'Acesso negado. Não pode consultar a história familiar de outros utentes.' });
                }
            }

            // --- 🩺 BARREIRA DE SEGURANÇA PARA MÉDICOS ---
            else if (utilizadorLogado.tipo_utilizador === 'medico') {
                const utenteAlvo = await utenteRepo.findOne({
                    where: { id: idUtenteUrl },
                    relations: ['medico']
                });

                if (!utenteAlvo) {
                    return res.status(404).json({ erro: 'Utente não encontrado no sistema.' });
                }

                if (!utenteAlvo.medico || utenteAlvo.medico.id !== utilizadorLogado.id) {
                    return res.status(403).json({ erro: 'Acesso negado. Apenas o médico responsável por este utente pode consultar a sua história familiar.' });
                }
            }

            const historias = await HistoriaFamiliarService.listarPorUtente(idUtenteUrl);
            return res.json(historias);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar história familiar do utente' });
        }
    },

    // POST /historia-familiar/utente/:id_utente
    criar: async (req: Request, res: Response) => {
        try {
            const id_medico_logado = req.user!.id;
            const id_utente_alvo = Number(req.params.id_utente);
            const { nome, descricao } = req.body;

            if (!id_utente_alvo) return res.status(400).json({ erro: 'O parâmetro id_utente na URL é obrigatório.' });
            if (!nome) return res.status(400).json({ erro: 'O nome (grau de parentesco) é obrigatório.' });
            if (!descricao) return res.status(400).json({ erro: 'A descrição clínica é obrigatória.' });

            // Validar se o utente pertence ao médico logado antes de criar o registo
            const { AppDataSource } = require('../database/database');
            const { Utente } = require('../models/utente.entity');
            const utenteRepo = AppDataSource.getRepository(Utente);

            const utente = await utenteRepo.findOne({
                where: { id: id_utente_alvo },
                relations: ['medico']
            });

            if (!utente) {
                return res.status(404).json({ erro: 'Utente não encontrado no sistema.' });
            }

            if (!utente.medico || utente.medico.id !== id_medico_logado) {
                return res.status(403).json({ erro: 'Acesso negado. Apenas o médico responsável por este utente pode adicionar antecedentes familiares.' });
            }

            const dadosDTO: CriarHistoriaFamiliarDTO = { nome, descricao };
            const historia = await HistoriaFamiliarService.criar(id_utente_alvo, dadosDTO);
            
            return res.status(201).json(historia);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message || 'Erro ao criar registo de história familiar' });
        }
    },

    // O buscarPorId, atualizar e eliminar mantêm-se funcionais
    buscarPorId: async (req: Request, res: Response) => {
        try {
            const historia = await HistoriaFamiliarService.buscarPorId(Number(req.params.id));
            if (!historia) return res.status(404).json({ erro: 'Registo de história familiar não encontrado' });
            return res.json(historia);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao buscar registo de história familiar' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const dadosDTO: { nome?: string; descricao?: string } = req.body;

            const historia = await HistoriaFamiliarService.atualizar(id, dadosDTO);
            if (!historia) return res.status(404).json({ erro: 'Registo de história familiar não encontrado' });
            
            return res.json(historia);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao atualizar registo de história familiar' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await HistoriaFamiliarService.eliminar(Number(req.params.id));
            return res.status(204).send();
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    }
};