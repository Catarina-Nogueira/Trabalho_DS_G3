import { Request, Response } from 'express';
import { HistoriaFamiliarService } from '../services/historiaFamiliar.services';

export const HistoriaFamiliarController = {

    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const historias = await HistoriaFamiliarService.listarPorUtente(Number(req.params.id_utente));
            res.json(historias);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar história familiar do utente' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const historia = await HistoriaFamiliarService.buscarPorId(Number(req.params.id));
            if (!historia) return res.status(404).json({ erro: 'Registo de história familiar não encontrado' });
            res.json(historia);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar registo de história familiar' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const historia = await HistoriaFamiliarService.criar(req.body);
            res.status(201).json(historia);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao criar registo de história familiar' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const historia = await HistoriaFamiliarService.atualizar(Number(req.params.id), req.body);
            if (!historia) return res.status(404).json({ erro: 'Registo de história familiar não encontrado' });
            res.json(historia);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao atualizar registo de história familiar' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await HistoriaFamiliarService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar registo de história familiar' });
        }
    }
};