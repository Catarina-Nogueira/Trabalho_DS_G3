import { Request, Response } from 'express';
import { AlertaService } from '../services/alerta.services';
import { EstadoAlerta, PrioridadeAlerta } from '../models/alerta.entity';

export const AlertaController = {

    // RF36 - Listagem de alertas direcionados ao Médico autenticado
    // src/controllers/alerta.controller.ts

    listarPorMedico: async (req: Request, res: Response) => {
        try {
            const id_medico = req.user!.id; // ID profissional do médico vindo da sessão/token
            const { estado, prioridade, id_utente } = req.query;

            const alertas = await AlertaService.listarPorMedico(
                id_medico,
                estado as EstadoAlerta,
                prioridade as PrioridadeAlerta,
                id_utente ? Number(id_utente) : undefined
            );
            
            return res.json(alertas);
        } catch (err: any) {
            return res.status(500).json({ erro: 'Erro ao listar alertas do médico' });
        }
    },

    // RF38 - Consulta de alertas pelo utente autenticado (CORRIGIDO)
    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const utilizadorLogado = req.user!;

            // 1. Fazer a ponte: Traduzir o ID de utilizador para o ID de utente clínico
            const { AppDataSource } = require('../database/database');
            const { Utente } = require('../models/utente.entity');
            const utenteRepo = AppDataSource.getRepository(Utente);

            const utenteDados = await utenteRepo.findOne({ 
                where: { utilizador: { id: utilizadorLogado.id } } 
            });

            if (!utenteDados) {
                return res.status(404).json({ erro: 'Perfil clínico de utente não encontrado para esta conta.' });
            }

            // 2. Passar o ID clínico real (ex: 1) para o serviço e não o de login (ex: 11)
            const alertas = await AlertaService.listarPorUtente(utenteDados.id);
            return res.json(alertas);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao listar alertas do utente' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const alerta = await AlertaService.buscarPorId(Number(req.params.id));
            
            // Segurança contra Alertas inexistentes (evita crash com erro 'cannot read property of null')
            if (!alerta || !alerta.avaliacao || !alerta.avaliacao.utente || !alerta.avaliacao.utente.medico) {
                return res.status(404).json({ erro: 'Alerta não encontrado.' });
            }
            
            // Validação para Utente (verifica se o alerta aponta para o ID clínico dele)
            if (req.user!.tipo_utilizador === 'utente') {
                const { AppDataSource } = require('../database/database');
                const { Utente } = require('../models/utente.entity');
                const utenteRepo = AppDataSource.getRepository(Utente);
                
                const utenteDados = await utenteRepo.findOne({ where: { utilizador: { id: req.user!.id } } });
                
                if (!utenteDados || alerta.avaliacao.utente.id !== utenteDados.id) {
                    return res.status(403).json({ erro: 'Não tem permissão para ver este alerta.' });
                }
            }
            
            // Validação para Médico (verifica se o alerta aponta para o ID dele)
            if (req.user!.tipo_utilizador === 'medico' && alerta.avaliacao.utente.medico.id !== req.user!.id) {
                return res.status(403).json({ erro: 'Este alerta pertence a utentes de outro médico.' });
            }

            return res.json(alerta);
        } catch (err: any) {
            return res.status(500).json({ erro: 'Erro ao buscar alerta' });
        }
    },

    // RF34 - Atualização do estado do alerta (Apenas Médicos Responsáveis)
    atualizarEstado: async (req: Request, res: Response) => {
        try {
            const { estado } = req.body;
            const id_alerta = Number(req.params.id);

            // 1. Procura o alerta na BD
            const alertaOriginal = await AlertaService.buscarPorId(id_alerta);
            
            // 2. GUARDA DE SEGURANÇA IMEDIATA (Resolve o erro do TypeScript!)
            if (!alertaOriginal || !alertaOriginal.avaliacao) {
                return res.status(404).json({ erro: 'Alerta ou avaliação não encontrada no sistema.' });
            }

            // 3. Agora o TypeScript sabe que 'alertaOriginal.avaliacao' existe a 100%
            if (alertaOriginal.avaliacao.utente.medico.id !== req.user!.id) {
                return res.status(403).json({ erro: 'Apenas o médico responsável pode alterar o estado deste alerta.' });
            }

            const alertaAtualizado = await AlertaService.atualizarEstado(id_alerta, { estado });
            return res.json(alertaAtualizado);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message || 'Erro ao atualizar estado do alerta' });
        }
    }
};