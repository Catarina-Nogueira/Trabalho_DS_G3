import { Request, Response } from 'express';
import { AlertaService } from '../services/alerta.services';
import { EstadoAlerta, PrioridadeAlerta } from '../models/alerta.entity';

export const AlertaController = {

    // RF36 - Listagem de alertas direcionados ao Médico autenticado
    listarPorMedico: async (req: Request, res: Response) => {
        try {
            const id_medico = req.user!.id; // Extraído da sessão de forma blindada
            const { estado, prioridade } = req.query;

            const alertas = await AlertaService.listarPorMedico(
                id_medico,
                estado as EstadoAlerta,
                prioridade as PrioridadeAlerta
            );
            return res.json(alertas);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao listar alertas do médico' });
        }
    },

    // RF38 - Consulta de alertas pelo utente autenticado
    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const id_utente = req.user!.id; // Extraído da sessão de forma blindada
            const alertas = await AlertaService.listarPorUtente(id_utente);
            return res.json(alertas);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao listar alertas do utente' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const alerta = await AlertaService.buscarPorId(Number(req.params.id));
            
            // Regra de negócio: Bloquear se não pertencer ao utilizador da sessão
            if (req.user!.tipo_utilizador === 'utente' && alerta.utente.id !== req.user!.id) {
                return res.status(403).json({ erro: 'Não tem permissão para ver este alerta.' });
            }
            if (req.user!.tipo_utilizador === 'medico' && alerta.medico.id !== req.user!.id) {
                return res.status(403).json({ erro: 'Este alerta pertence a utentes de outro médico.' });
            }

            return res.json(alerta);
        } catch (err: any) {
            return res.status(500).json({ erro: 'Erro ao buscar alerta' });
        }
    },

    // RF34 - Atualização do estado do alerta (Apenas Médicos)
    atualizarEstado: async (req: Request, res: Response) => {
        try {
            const { estado } = req.body;
            const id_alerta = Number(req.params.id);

            const alertaOriginal = await AlertaService.buscarPorId(id_alerta);
            if (alertaOriginal.medico.id !== req.user!.id) {
                return res.status(403).json({ erro: 'Apenas o médico responsável pode alterar o estado deste alerta.' });
            }

            const alertaAtualizado = await AlertaService.atualizarEstado(id_alerta, { estado });
            return res.json(alertaAtualizado);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message || 'Erro ao atualizar estado do alerta' });
        }
    }
};