import { Request, Response } from 'express';
import { DadoAdministrativoService } from '../services/dadoAdministrativo.services';
import { CriarDadoAdministrativoDTO, AtualizarDadoAdministrativoDTO } from '../dtos/dadoAdministrativo.dto';

export const DadoAdministrativoController = {

    buscarPorUtente: async (req: Request, res: Response) => {
        try {
            const dado = await DadoAdministrativoService.buscarPorUtente(Number(req.params.id_utente));
            if (!dado) return res.status(404).json({ erro: 'Dados administrativos não encontrados' });
            return res.json(dado);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao buscar dados administrativos do utente' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const dado = await DadoAdministrativoService.buscarPorId(Number(req.params.id));
            if (!dado) return res.status(404).json({ erro: 'Dados administrativos não encontrados' });
            return res.json(dado);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao buscar dados administrativos' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const id_utente = Number(req.params.id_utente);
            const { morada, nif, telemovel } = req.body;

            if (!id_utente) return res.status(400).json({ erro: 'O id_utente na URL é obrigatório.' });
            if (!morada) return res.status(400).json({ erro: 'A morada é obrigatória.' });
            if (!nif) return res.status(400).json({ erro: 'O NIF é obrigatório.' });
            if (!telemovel) return res.status(400).json({ erro: 'O telemóvel é obrigatório.' });

            const dadosDTO: CriarDadoAdministrativoDTO = { morada, nif: Number(nif), telemovel };
            const dado = await DadoAdministrativoService.criar(id_utente, dadosDTO);
            return res.status(201).json(dado);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const dadosDTO: AtualizarDadoAdministrativoDTO = req.body;

            const dado = await DadoAdministrativoService.atualizar(id, dadosDTO);
            if (!dado) return res.status(404).json({ erro: 'Dados administrativos não encontrados' });
            return res.json(dado);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao atualizar dados administrativos' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await DadoAdministrativoService.eliminar(Number(req.params.id));
            return res.status(204).send();
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    }
};