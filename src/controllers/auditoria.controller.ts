import { Request, Response } from 'express';
import { AuditoriaService } from '../services/auditoria.services';

export const AuditoriaController = {

    // RF57 - Listagem e filtragem de logs
    listarComFiltros: async (req: Request, res: Response) => {
        try {
            const { id_utilizador, entidade_afetada, acao, data_inicio, data_fim, pagina, limite } = req.query;

            const resultado = await AuditoriaService.listarComFiltros(
                id_utilizador ? Number(id_utilizador) : undefined,
                entidade_afetada as string,
                acao as string,
                data_inicio as string,
                data_fim as string,
                pagina ? Number(pagina) : 1,
                limite ? Number(limite) : 10
            );
            res.json(resultado);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar logs de auditoria' });
        }
    },

    // RF58 - Exportação de logs em JSON
    exportar: async (req: Request, res: Response) => {
        try {
            const { id_utilizador, entidade_afetada, acao, data_inicio, data_fim } = req.query;

            const registos = await AuditoriaService.exportar(
                id_utilizador ? Number(id_utilizador) : undefined,
                entidade_afetada as string,
                acao as string,
                data_inicio as string,
                data_fim as string
            );

            // Define o ficheiro para download
            res.setHeader('Content-Disposition', 'attachment; filename=auditoria.json');
            res.setHeader('Content-Type', 'application/json');
            res.json(registos);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao exportar logs de auditoria' });
        }
    }
};