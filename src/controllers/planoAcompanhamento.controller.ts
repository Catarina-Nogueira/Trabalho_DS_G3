import { Request, Response } from 'express';
import { PlanoAcompanhamentoService } from '../services/planoAcompanhamento.services';
import { CriarPlanoDTO, AtualizarPlanoDTO } from '../dtos/planoAcompanhamento.dto';

export const PlanoAcompanhamentoController = {

    // POST /planos/utente/:id_utente
    criar: async (req: Request, res: Response) => {
        try {
            // id_medico vem injetado pelo middleware de sessão
            const id_medico = Number(req.user?.id); 
            const id_utente = Number(req.params.id_utente);
            const { descricao, data_inicio, data_fim } = req.body;

            if (!id_medico) return res.status(401).json({ erro: 'Sessão do médico inválida.' });
            if (!id_utente) return res.status(400).json({ erro: 'O parâmetro id_utente na URL é obrigatório.' });
            if (!descricao) return res.status(400).json({ erro: 'A descrição do plano é obrigatória.' });
            if (!data_inicio) return res.status(400).json({ erro: 'A data de início do plano é obrigatória.' });

            const dadosDTO: CriarPlanoDTO = { descricao, data_inicio, data_fim: data_fim || null };
            
            const plano = await PlanoAcompanhamentoService.criar(id_medico, id_utente, dadosDTO);
            return res.status(201).json(plano);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    },

    // GET /planos/utente/:id_utente
    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const id_utente = Number(req.params.id_utente);
            if (!id_utente) return res.status(400).json({ erro: 'O parâmetro id_utente na URL é obrigatório.' });

            const planos = await PlanoAcompanhamentoService.listarPorUtente(id_utente);
            return res.json(planos);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar planos de acompanhamento do utente.' });
        }
    },

    // GET /planos/medico/:id_medico
    listarPorMedico: async (req: Request, res: Response) => {
        try {
            const id_medico = Number(req.params.id_medico);
            if (!id_medico) return res.status(400).json({ erro: 'O parâmetro id_medico na URL é obrigatório.' });

            const planos = await PlanoAcompanhamentoService.listarPorMedico(id_medico);
            return res.json(planos);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar planos de acompanhamento do médico.' });
        }
    },

    // PUT /planos/:id
    atualizar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const dadosDTO: AtualizarPlanoDTO = req.body;
            
            const plano = await PlanoAcompanhamentoService.atualizar(id, dadosDTO);
            if (!plano) return res.status(404).json({ erro: 'Plano de acompanhamento não encontrado.' });
            
            return res.json(plano);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao atualizar plano de acompanhamento.' });
        }
    },

    // DELETE /planos/:id
    eliminar: async (req: Request, res: Response) => {
        try {
            await PlanoAcompanhamentoService.eliminar(Number(req.params.id));
            return res.status(204).send();
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    }
};