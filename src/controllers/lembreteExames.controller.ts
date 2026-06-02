import { Request, Response } from 'express';
import { LembreteService } from '../services/lembreteExames.services';

export const LembreteController = {

    // GET /lembretes/proximos
    listarProximosLembretes: async (req: Request, res: Response) => {
        try {
            const lembretes = await LembreteService.listarLembretesDoDiaSeguinte();
            return res.json(lembretes);
        } catch (err: any) {
            return res.status(500).json({ erro: 'Erro ao listar próximos lembretes.' });
        }
    },

    // POST /lembretes/disparar-manual
    forcarDisparoLembretes: async (req: Request, res: Response) => {
        try {
            await LembreteService.verificarEEnviarLembretes();
            return res.json({ mensagem: 'Processamento de lembretes manuais executado com sucesso.' });
        } catch (err: any) {
            return res.status(500).json({ erro: 'Erro ao forçar disparo de lembretes.' });
        }
    }
};