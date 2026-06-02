import { Request, Response } from 'express';
import { HistoriaFamiliarService } from '../services/historiaFamiliar.services';
import { CriarHistoriaFamiliarDTO, AtualizarHistoriaFamiliarDTO } from '../dtos/historiaFamiliar.dto';

export const HistoriaFamiliarController = {

    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const historias = await HistoriaFamiliarService.listarPorUtente(Number(req.params.id_utente));
            return res.json(historias);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar história familiar do utente' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const historia = await HistoriaFamiliarService.buscarPorId(Number(req.params.id));
            if (!historia) return res.status(404).json({ erro: 'Registo de história familiar não encontrado' });
            return res.json(historia);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao buscar registo de história familiar' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const id_utente = Number(req.params.id_utente);
            const { nome, descricao } = req.body;

            if (!id_utente) return res.status(400).json({ erro: 'O parâmetro id_utente na URL é obrigatório.' });
            if (!nome) return res.status(400).json({ erro: 'O nome (grau de parentesco) é obrigatório.' });
            if (!descricao) return res.status(400).json({ erro: 'A descrição clínica é obrigatória.' });

            const dadosDTO: CriarHistoriaFamiliarDTO = { nome, descricao };
            const historia = await HistoriaFamiliarService.criar(id_utente, dadosDTO);
            
            return res.status(201).json(historia);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const dadosDTO: AtualizarHistoriaFamiliarDTO = req.body;

            const historia = await HistoriaFamiliarService.atualizar(id, dadosDTO);
            if (!historia) return res.status(404).json({ erro: 'Registo de história familiar não encontrado' });
            
            return res.json(historia);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao atualizar registo de história familiar' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await HistoriaFamiliarService.eliminar(Number(req.params.id));
            return res.status(204).send();
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    }
};