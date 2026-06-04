import { Request, Response } from 'express';
import { ComorbilidadeService } from '../services/comorbilidades.service';
import { CriarComorbilidadeDTO, AtualizarComorbilidadeDTO } from '../dtos/comorbilidade.dto';

export const ComorbilidadeController = {

    // POST /comorbilidades/utente/:id_utente
    criar: async (req: Request, res: Response) => {
        try {
            const id_medico_logado = req.user!.id; // ID do médico vindo da sessão/token
            const id_utente_alvo = Number(req.params.id_utente);
            const { nome, descricao } = req.body;

            if (!id_utente_alvo) return res.status(400).json({ erro: 'O parâmetro id_utente na URL é obrigatório.' });
            if (!nome) return res.status(400).json({ erro: 'O nome da comorbilidade é obrigatório.' });
            if (!descricao) return res.status(400).json({ erro: 'A descrição da comorbilidade é obrigatória.' });

            // 1. Validar se o utente existe e pertence a este médico
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

            // 2. BARREIRA DE SEGURANÇA: Impede médicos intrusos de alterar a ficha clínica
            if (!utente.medico || utente.medico.id !== id_medico_logado) {
                return res.status(403).json({ erro: 'Acesso negado. Apenas o médico responsável por este utente pode adicionar comorbilidades.' });
            }

            // 3. Se passou na validação, cria a comorbilidade
            const dadosDTO: CriarComorbilidadeDTO = { nome, descricao };
            const comorbilidade = await ComorbilidadeService.criar(id_utente_alvo, dadosDTO);
            
            return res.status(201).json(comorbilidade);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao criar comorbilidade' });
        }
    },

    // Os restantes métodos (listarPorUtente, atualizar, eliminar) mantêm-se iguais...
    // GET /comorbilidades/utente/:id_utente
    // GET /comorbilidades/utente/:id_utente
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
                    return res.status(403).json({ erro: 'Acesso negado. Não pode consultar comorbilidades de outros utentes.' });
                }
            }

            // --- 🩺 BARREIRA DE SEGURANÇA PARA MÉDICOS (NOVO) ---
            else if (utilizadorLogado.tipo_utilizador === 'medico') {
                const utenteAlvo = await utenteRepo.findOne({
                    where: { id: idUtenteUrl },
                    relations: ['medico']
                });

                if (!utenteAlvo) {
                    return res.status(404).json({ erro: 'Utente não encontrado no sistema.' });
                }

                // Bloqueia se o médico logado não for o médico atribuído a este utente
                if (!utenteAlvo.medico || utenteAlvo.medico.id !== utilizadorLogado.id) {
                    return res.status(403).json({ erro: 'Acesso negado. Apenas o médico responsável por este utente pode consultar o seu histórico de comorbilidades.' });
                }
            }

            // Se passou em todas as verificações, lista os dados
            const comorbilidades = await ComorbilidadeService.listarPorUtente(idUtenteUrl);
            return res.json(comorbilidades);

        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar comorbilidades do utente.' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const dadosDTO: AtualizarComorbilidadeDTO = req.body;
            const comorbilidade = await ComorbilidadeService.atualizar(id, dadosDTO);
            if (!comorbilidade) return res.status(404).json({ erro: 'Comorbilidade não encontrada' });
            return res.json(comorbilidade);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao atualizar comorbilidade' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await ComorbilidadeService.eliminar(Number(req.params.id));
            return res.status(204).send();
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    }
};