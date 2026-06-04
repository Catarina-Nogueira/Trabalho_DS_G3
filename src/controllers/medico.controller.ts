import { Request, Response } from 'express';
import { MedicoService } from '../services/medico.services';
import { CriarMedicoDTO, AtualizarMedicoDTO } from '../dtos/medico.dto';

export const MedicoController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const medicos = await MedicoService.listarTodos();
            return res.json(medicos);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao listar médicos' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const utilizadorLogado = req.user!;
            const id_medico = Number(req.params.id);

            const medico = await MedicoService.buscarPorId(id_medico);

            // Se for médico, impede que consulte o perfil de outros médicos
            if (utilizadorLogado.tipo_utilizador === 'medico' && medico.utilizador.id !== utilizadorLogado.id) {
                return res.status(403).json({ erro: 'Acesso negado. Não pode ler perfis de outros médicos.' });
            }

            return res.json(medico);
        } catch (err: any) {
            const status = err.message === 'Médico não encontrado' ? 404 :
                           err.message === 'ID inválido' ? 400 : 500;
            return res.status(status).json({ erro: err.message });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const id_utilizador_logado = req.user!.id; 
            const id_utilizador = Number(req.params.id_utilizador);
            const dadosDTO: CriarMedicoDTO = req.body;

            if (!id_utilizador) {
                return res.status(400).json({ erro: 'O parâmetro id_utilizador na URL é obrigatório.' });
            }

            const medico = await MedicoService.criar(id_utilizador, dadosDTO, id_utilizador_logado);
            return res.status(201).json(medico);
        } catch (err: any) {
            const status = err.message.includes('obrigatório') ? 400 :
                           err.message.includes('Já existe') ? 409 : 500;
            return res.status(status).json({ erro: err.message });
        }
    },

    atualizarTelemovel: async (req: Request, res: Response) => {
        try {
            const utilizadorLogado = req.user!;
            const id = Number(req.params.id);
            const { telemovel } = req.body;
            
            if (!telemovel) return res.status(400).json({ erro: 'O campo telemóvel é obrigatório.' });
            
            // Primeiro buscamos o médico para avaliar o utilizador dono do perfil
            const medicoAlvo = await MedicoService.buscarPorId(id);

            // Bloqueia atualizações de telemóvel de terceiros
            if (utilizadorLogado.tipo_utilizador === 'medico' && medicoAlvo.utilizador.id !== utilizadorLogado.id) {
                return res.status(403).json({ erro: 'Acesso negado. Não pode alterar dados de outros médicos.' });
            }

            const dadosDTO: AtualizarMedicoDTO = { telemovel };
            const medico = await MedicoService.atualizar(id, dadosDTO, utilizadorLogado.id);
            
            return res.json(medico);
        } catch (err: any) {
            const status = err.message === 'Médico não encontrado' ? 404 :
                           err.message === 'ID inválido' ? 400 : 500;
            return res.status(status).json({ erro: err.message });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            const id_utilizador_logado = req.user!.id;
            const id = Number(req.params.id);

            const resultado = await MedicoService.eliminar(id, id_utilizador_logado);
            return res.json(resultado);
        } catch (err: any) {
            const status = err.message === 'Médico não encontrado' ? 404 :
                           err.message === 'ID inválido' ? 400 : 500;
            return res.status(status).json({ erro: err.message });
        }
    }
};