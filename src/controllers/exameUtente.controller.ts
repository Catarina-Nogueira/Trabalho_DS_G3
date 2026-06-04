// src/controllers/exameUtente.controller.ts
import { Request, Response } from 'express';
import { ExameUtenteService } from '../services/exameUtente.services';

async function validarAcessoFichaUtente(utilizadorLogado: any, idUtenteUrl: number): Promise<{ valido: boolean; erro?: string; status?: number }> {
    const { AppDataSource } = require('../database/database');
    const { Utente } = require('../models/utente.entity');
    const utenteRepo = AppDataSource.getRepository(Utente);

    if (utilizadorLogado.tipo_utilizador === 'utente') {
        const utenteDados = await utenteRepo.findOne({ where: { utilizador: { id: utilizadorLogado.id } } });
        if (!utenteDados || utenteDados.id !== idUtenteUrl) {
            return { valido: false, erro: 'Acesso negado. Não pode consultar exames de outros utentes.', status: 403 };
        }
    } else if (utilizadorLogado.tipo_utilizador === 'medico') {
        const utenteAlvo = await utenteRepo.findOne({ where: { id: idUtenteUrl }, relations: ['medico'] });
        if (!utenteAlvo) {
            return { valido: false, erro: 'Utente não encontrado no sistema.', status: 404 };
        }
        if (!utenteAlvo.medico || utenteAlvo.medico.id !== utilizadorLogado.id) {
            return { valido: false, erro: 'Acesso negado. Apenas o médico responsável por este utente pode consultar este histórico.', status: 403 };
        }
    }
    return { valido: true };
}

export const ExameUtenteController = {

    // GET /exame-utente/utente/:id_utente/historico
    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const id_utente = Number(req.params.id_utente);
            if (!id_utente) return res.status(400).json({ erro: 'O parâmetro id_utente na URL é obrigatório.' });

            const controlo = await validarAcessoFichaUtente(req.user!, id_utente);
            if (!controlo.valido) return res.status(controlo.status!).json({ erro: controlo.erro });

            const exames = await ExameUtenteService.listarPorUtente(id_utente);
            return res.json(exames);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar exames do utente' });
        }
    },

    // GET /exame-utente/utente/:id_utente/pendentes
    listarPendentesPorUtente: async (req: Request, res: Response) => {
        try {
            const id_utente = Number(req.params.id_utente);
            if (!id_utente) return res.status(400).json({ erro: 'O parâmetro id_utente na URL é obrigatório.' });

            const controlo = await validarAcessoFichaUtente(req.user!, id_utente);
            if (!controlo.valido) return res.status(controlo.status!).json({ erro: controlo.erro });

            const exames = await ExameUtenteService.listarPendentesPorUtente(id_utente);
            return res.json(exames);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar exames pendentes' });
        }
    },

    // GET /exame-utente/requisitados
    listarPorMedico: async (req: Request, res: Response) => {
        try {
            const id_medico = req.user!.id; 
            const exames = await ExameUtenteService.listarPorMedico(id_medico);
            return res.json(exames);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar exames do médico' });
        }
    },

    // GET /exame-utente/:id
    buscarPorId: async (req: Request, res: Response) => {
        try {
            const exame = await ExameUtenteService.buscarPorId(Number(req.params.id));
            if (!exame) return res.status(404).json({ erro: 'Exame não encontrado' });

            // Validações de segurança por vínculo direto com a requisição específica
            if (req.user!.tipo_utilizador === 'utente' && exame.utente.id !== req.user!.id) {
                return res.status(403).json({ erro: 'Não tem permissão para consultar este exame.' });
            }
            if (req.user!.tipo_utilizador === 'medico' && exame.medico.id !== req.user!.id) {
                return res.status(403).json({ erro: 'Acesso negado. Este exame pertence à carteira de outro clínico.' });
            }

            return res.json(exame);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao buscar exame' });
        }
    },

    // POST /exame-utente/utente/:id_utente
    criar: async (req: Request, res: Response) => {
        try {
            const id_medico_logado = req.user!.id;
            const id_utente_alvo = Number(req.params.id_utente); // Capturado limpo do contexto do sistema
            const { id_exame, data_exame } = req.body;

            if (!id_utente_alvo) return res.status(400).json({ erro: 'O parâmetro id_utente na URL é obrigatório.' });
            if (!id_exame || !data_exame) return res.status(400).json({ erro: 'Campos obrigatórios em falta (id_exame, data_exame).' });

            // Garantir que o médico logado é o responsável direto pelo utente do URL
            const { AppDataSource } = require('../database/database');
            const { Utente } = require('../models/utente.entity');
            const utenteRepo = AppDataSource.getRepository(Utente);

            const utenteAlvo = await utenteRepo.findOne({
                where: { id: id_utente_alvo },
                relations: ['medico']
            });

            if (!utenteAlvo) return res.status(404).json({ erro: 'Utente não encontrado no sistema.' });
            
            if (!utenteAlvo.medico || utenteAlvo.medico.id !== id_medico_logado) {
                return res.status(403).json({ erro: 'Acesso negado. Apenas o médico responsável por este utente pode prescrever exames.' });
            }

            const novoExame = await ExameUtenteService.criar({
                utente: { id: id_utente_alvo },
                medico: { id: id_medico_logado },
                exame: { id: Number(id_exame) },
                data_exame
            });

            return res.status(201).json(novoExame);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao prescrever exame' });
        }
    },

    // PATCH /exame-utente/:id/resultado
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

            const examenAtualizado = await ExameUtenteService.registarResultado(id_requisicao, resultado, interpretacao);
            return res.json(examenAtualizado);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao registar resultado do exame' });
        }
    },

    // DELETE /exame-utente/:id
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