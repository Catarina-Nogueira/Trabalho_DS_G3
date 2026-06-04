import { Request, Response } from 'express';
import { RecomendacaoService } from '../services/recomendacao.services';

export const RecomendacaoController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const recomendacoes = await RecomendacaoService.listarTodos();
            res.json(recomendacoes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar recomendações' });
        }
    },

    listarPorAvaliacao: async (req: Request, res: Response) => {
        try {
            const recomendacoes = await RecomendacaoService.listarPorAvaliacao(Number(req.params.id_avaliacao));
            res.json(recomendacoes);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar recomendações da avaliação' });
        }
    },

    listarPorUtente: async (req: Request, res: Response) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ erro: 'Sessão inválida ou utilizador não autenticado.' });
            }

            const utilizadorLogado = req.user;
            const idUtenteUrl = Number(req.params.id_utente);

            if (!idUtenteUrl) {
                return res.status(400).json({ erro: 'ID do utente inválido ou em falta.' });
            }

            // Como agora esta rota é só para UTENTES, fazemos a validação direta
            if (utilizadorLogado.tipo_utilizador !== 'utente') {
                return res.status(403).json({ erro: 'Acesso negado. Esta rota é exclusiva para utentes.' });
            }

            // 1. Procurar o perfil clínico do utente com base no utilizador da sessão
            const { AppDataSource } = require('../database/database');
            const { Utente } = require('../models/utente.entity');
            const utenteRepo = AppDataSource.getRepository(Utente);

            const utenteDados = await utenteRepo.findOne({ 
                where: { utilizador: { id: utilizadorLogado.id } } 
            });

            if (!utenteDados) {
                return res.status(404).json({ erro: 'Perfil clínico de utente não encontrado.' });
            }

            // 2. Bloqueia se o utente tentar meter o ID de outro utente no URL
            if (utenteDados.id !== idUtenteUrl) {
                return res.status(403).json({ erro: 'Acesso negado. Não pode consultar dados de outro utente.' });
            }

            // 3. Tudo OK, chama o serviço
            const recomendacoes = await RecomendacaoService.listarPorUtente(idUtenteUrl);
            return res.json(recomendacoes);

        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao obter recomendações do utente.' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const recomendacao = await RecomendacaoService.buscarPorId(Number(req.params.id));
            if (!recomendacao) return res.status(404).json({ erro: 'Recomendação não encontrada' });
            res.json(recomendacao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar recomendação' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const recomendacao = await RecomendacaoService.criar(req.body);
            res.status(201).json(recomendacao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao criar recomendação' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const recomendacao = await RecomendacaoService.atualizar(Number(req.params.id), req.body);
            if (!recomendacao) return res.status(404).json({ erro: 'Recomendação não encontrada' });
            res.json(recomendacao);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao atualizar recomendação' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await RecomendacaoService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar recomendação' });
        }
    }

};