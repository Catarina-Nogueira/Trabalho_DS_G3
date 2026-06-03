import { Request, Response } from 'express';
import { AuditoriaService } from '../services/auditoria.services';

export const AuditoriaController = {

    listarLogs: async (req: Request, res: Response) => {
        try {
            const logs = await AuditoriaService.listarTodosOsLogs();
            return res.json(logs);
        } catch (err: any) {
            return res.status(500).json({ erro: 'Erro ao extrair logs de auditoria do sistema.' });
        }
    }
};