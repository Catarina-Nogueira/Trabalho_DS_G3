import { Request, Response } from 'express';
import { SintomaReportadoService } from '../services/sintomaReportado.services';
import { CriarSintomaReportadoDTO } from '../dtos/sintomaReportado.dto';

export const SintomaReportadoController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const sintomas = await SintomaReportadoService.listarTodos();
            return res.json(sintomas);
        } catch (err: any) {
            return res.status(500).json({ erro: 'Erro ao listar todos os sintomas.' });
        }
    },

    // GET /sintomas/meu-historico
    listarMeuHistorico: async (req: Request, res: Response) => {
        try {
            const id_utilizador_sessao =  req.user!.id;
            const sintomas = await SintomaReportadoService.listarPorUtilizadorSessao(id_utilizador_sessao);
            return res.json(sintomas);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const sintoma = await SintomaReportadoService.buscarPorId(Number(req.params.id));
            return res.json(sintoma);
        } catch (err: any) {
            return res.status(404).json({ erro: err.message });
        }
    },

    // POST /sintomas
    reportar: async (req: Request, res: Response) => {
        try {
            const id_utilizador_sessao = req.user!.id
            const dadosDTO: CriarSintomaReportadoDTO = req.body;

            const novoRegisto = await SintomaReportadoService.reportar(id_utilizador_sessao, dadosDTO);
            return res.status(201).json(novoRegisto);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message || 'Erro ao processar o seu relatório de sintomas.' });
        }
    },

};