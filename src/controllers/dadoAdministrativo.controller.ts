import { Request, Response } from 'express';
import { DadoAdministrativoService } from '../services/dadoAdministrativo.services';

export const DadoAdministrativoController = {

    buscarPorUtente: async (req: Request, res: Response) => {
        try {
            const dado = await DadoAdministrativoService.buscarPorUtente(Number(req.params.id_utente));
            if (!dado) return res.status(404).json({ erro: 'Dados administrativos não encontrados' });
            res.json(dado);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar dados administrativos do utente' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const dado = await DadoAdministrativoService.buscarPorId(Number(req.params.id));
            if (!dado) return res.status(404).json({ erro: 'Dados administrativos não encontrados' });
            res.json(dado);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar dados administrativos' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const dado = await DadoAdministrativoService.criar(req.body);
            res.status(201).json(dado);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao criar dados administrativos' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const dado = await DadoAdministrativoService.atualizar(Number(req.params.id), req.body);
            if (!dado) return res.status(404).json({ erro: 'Dados administrativos não encontrados' });
            res.json(dado);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao atualizar dados administrativos' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await DadoAdministrativoService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar dados administrativos' });
        }
    }
};