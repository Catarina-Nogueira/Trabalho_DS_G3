import { Request, Response } from 'express';
import { SintomaReportadoService } from '../services/sintomaReportado.services';
import { CriarSintomaReportadoDTO } from '../dtos/sintomaReportado.dto';

export const SintomaReportadoController = {

    // POST /sintomas/utente/:id_utente
    reportar: async (req: Request, res: Response) => {
        try {
            const id_utilizador_sessao = req.user!.id;
            const id_utente_url = Number(req.params.id_utente);
            const dadosDTO: CriarSintomaReportadoDTO = req.body;

            if (!id_utente_url) {
                return res.status(400).json({ erro: 'O parâmetro id_utente na URL é obrigatório.' });
            }

            // BARREIRA DE SEGURANÇA: Garante que o Utente logado não está a tentar injetar dados no ID de outro utente
            const { AppDataSource } = require('../database/database');
            const { Utente } = require('../models/utente.entity');
            const utenteRepo = AppDataSource.getRepository(Utente);
            
            const utenteDados = await utenteRepo.findOne({ where: { utilizador: { id: id_utilizador_sessao } } });
            if (!utenteDados || utenteDados.id !== id_utente_url) {
                return res.status(403).json({ erro: 'Acesso negado. Não pode reportar sintomas por outro utente.' });
            }

            const novoRegisto = await SintomaReportadoService.reportar(id_utilizador_sessao, dadosDTO);
            return res.status(201).json(novoRegisto);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message || 'Erro ao processar o seu relatório de sintomas.' });
        }
    },

    // GET /sintomas/utente/:id_utente/historico
    listarHistoricoPorUtente: async (req: Request, res: Response) => {
        try {
            const utilizadorLogado = req.user!;
            const id_utente_url = Number(req.params.id_utente);

            if (!id_utente_url) {
                return res.status(400).json({ erro: 'O parâmetro id_utente na URL é obrigatório.' });
            }

            const { AppDataSource } = require('../database/database');
            const { Utente } = require('../models/utente.entity');
            const utenteRepo = AppDataSource.getRepository(Utente);

            // --- 👤 SE FOR UTENTE: Só pode ver o seu próprio histórico ---
            if (utilizadorLogado.tipo_utilizador === 'utente') {
                const utenteDados = await utenteRepo.findOne({ where: { utilizador: { id: utilizadorLogado.id } } });
                if (!utenteDados || utenteDados.id !== id_utente_url) {
                    return res.status(403).json({ erro: 'Acesso negado. Não pode consultar o histórico de outros utentes.' });
                }
            } 
            
            // --- 🩺 SE FOR MÉDICO: Só pode ver se for o tutor responsável ---
            else if (utilizadorLogado.tipo_utilizador === 'medico') {
                const utenteAlvo = await utenteRepo.findOne({ where: { id: id_utente_url }, relations: ['medico'] });
                if (!utenteAlvo) {
                    return res.status(404).json({ erro: 'Utente não encontrado.' });
                }
                if (!utenteAlvo.medico || utenteAlvo.medico.id !== utilizadorLogado.id) {
                    return res.status(403).json({ erro: 'Acesso negado. Apenas o médico responsável por este utente pode ver este histórico de sintomas.' });
                }
            }

            // Reutiliza o teu método existente do Service passando o ID clínico validado
            const sintomas = await SintomaReportadoService.listarPorIdClinico(id_utente_url);
            return res.json(sintomas);
        } catch (err: any) {
            return res.status(500).json({ erro: 'Erro ao obter histórico de sintomas.' });
        }
    },

    // Mantêm-se inalterados
    listarTodos: async (req: Request, res: Response) => {
        try {
            const id_utilizador_sessao = req.user!.id;
            const tipo_utilizador_sessao = req.user!.tipo_utilizador;
            const sintomas = await SintomaReportadoService.listarTodos(id_utilizador_sessao, tipo_utilizador_sessao);
            return res.json(sintomas);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao listar os sintomas.' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const examen = await SintomaReportadoService.buscarPorId(Number(req.params.id));
            return res.json(examen);
        } catch (err: any) {
            return res.status(404).json({ erro: err.message });
        }
    }
};