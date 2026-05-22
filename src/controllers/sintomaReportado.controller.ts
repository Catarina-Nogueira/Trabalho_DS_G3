import { Request, Response } from 'express';
import { SintomaReportadoService } from '../services/sintomaReportado.services';

export const SintomaReportadoController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const sintomas = await SintomaReportadoService.listarTodos();
            res.json(sintomas);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar sintomas reportados' });
        }
    },

    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const sintomas = await SintomaReportadoService.listarPorUtente(Number(req.params.id_utente));
            res.json(sintomas);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar sintomas reportados do utente' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const sintoma = await SintomaReportadoService.buscarPorId(Number(req.params.id));
            if (!sintoma) return res.status(404).json({ erro: 'Sintoma reportado não encontrado' });
            res.json(sintoma);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar sintoma reportado' });
        }
    },

    // RF54 - Reporte de sintomas pelo utente
    reportar: async (req: Request, res: Response) => {
        try {
            const { id_utente, ...dados } = req.body;
            if (!id_utente) {
                return res.status(400).json({ erro: 'id_utente é obrigatório' });
            }
            const sintoma = await SintomaReportadoService.reportar(id_utente, dados);
            res.status(201).json(sintoma);
        } catch (err: any) {
            if (err.message) {
                return res.status(400).json({ erro: err.message });
            }
            res.status(500).json({ erro: 'Erro ao reportar sintoma' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const sintoma = await SintomaReportadoService.atualizar(Number(req.params.id), req.body);
            if (!sintoma) return res.status(404).json({ erro: 'Sintoma reportado não encontrado' });
            res.json(sintoma);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao atualizar sintoma reportado' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await SintomaReportadoService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar sintoma reportado' });
        }
    }

};