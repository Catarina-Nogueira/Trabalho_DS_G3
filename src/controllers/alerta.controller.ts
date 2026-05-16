import { Request, Response } from 'express';
import { AlertaService } from '../services/alerta.services';
import { EstadoAlerta, TipoAlerta } from '../models/alerta.entity';

export const AlertaController = {

    // RF36 - Listagem de alertas do médico com filtros
    listarPorMedico: async (req: Request, res: Response) => {
        try {
            const { estado, prioridade } = req.query;
            const alertas = await AlertaService.listarPorMedico(
                Number(req.params.id_medico),
                estado as string,
                prioridade as string
            );
            res.json(alertas);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar alertas do médico' });
        }
    },

    // RF38 - Consulta de alertas pelo utente
    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const alertas = await AlertaService.listarPorUtente(Number(req.params.id_utente));
            res.json(alertas);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar alertas do utente' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const alerta = await AlertaService.buscarPorId(Number(req.params.id));
            if (!alerta) return res.status(404).json({ erro: 'Alerta não encontrado' });
            res.json(alerta);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar alerta' });
        }
    },

    // RF29-RF33 - Gerar alerta manualmente
    gerarAlerta: async (req: Request, res: Response) => {
        try {
            const { id_utente, id_medico, tipo, motivo, id_avaliacao, id_sintoma } = req.body;

            if (!id_utente || !id_medico || !tipo || !motivo) {
                return res.status(400).json({ erro: 'Campos obrigatórios em falta' });
            }

            const alerta = await AlertaService.gerarAlerta(
                id_utente, id_medico, tipo, motivo, id_avaliacao, id_sintoma
            );
            res.status(201).json(alerta);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao gerar alerta' });
        }
    },

    // RF34 - Atualização do estado do alerta
    atualizarEstado: async (req: Request, res: Response) => {
        try {
            const { estado } = req.body;

            if (!Object.values(EstadoAlerta).includes(estado)) {
                return res.status(400).json({ erro: 'Estado inválido' });
            }

            const alerta = await AlertaService.atualizarEstado(Number(req.params.id), estado);
            if (!alerta) return res.status(404).json({ erro: 'Alerta não encontrado' });
            res.json(alerta);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao atualizar estado do alerta' });
        }
    },

};