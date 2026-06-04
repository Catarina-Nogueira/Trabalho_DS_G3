import { Request, Response } from 'express';
import { MedicacaoUtenteService } from '../services/medicacaoUtente.services';
import { AppDataSource } from '../database/database';
import { Utente } from '../models/utente.entity';
import { Medico } from '../models/medico.entity';

const utenteRepo = AppDataSource.getRepository(Utente);
const medicoRepo = AppDataSource.getRepository(Medico);

export const MedicacaoUtenteController = {

    // GET /medicacao-utente/historico/:id_utente
    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const utilizadorLogado = req.user!;
            const id_utente = Number(req.params.id_utente);

            if (!id_utente) return res.status(400).json({ erro: 'O parâmetro id_utente na URL é obrigatório.' });

            // 🛡️ BARREIRA DE SEGURANÇA: Validar acessos cruzados
            if (utilizadorLogado.tipo_utilizador === 'utente') {
                const utenteDados = await utenteRepo.findOne({ where: { utilizador: { id: utilizadorLogado.id } } });
                if (!utenteDados || utenteDados.id !== id_utente) {
                    return res.status(403).json({ erro: 'Acesso negado. Não pode consultar medicações de outros utentes.' });
                }
            } else if (utilizadorLogado.tipo_utilizador === 'medico') {
                const utenteAlvo = await utenteRepo.findOne({ where: { id: id_utente }, relations: ['medico'] });
                if (!utenteAlvo) return res.status(404).json({ erro: 'Utente não encontrado.' });
                
                // Buscar perfil de médico do utilizador logado para validar se é o responsável
                const medicoLogado = await medicoRepo.findOne({ where: { utilizador: { id: utilizadorLogado.id } } });
                if (!medicoLogado || !utenteAlvo.medico || utenteAlvo.medico.id !== medicoLogado.id) {
                    return res.status(403).json({ erro: 'Acesso negado. Apenas o médico responsável pode consultar esta ficha clínica.' });
                }
            }

            const medicacoes = await MedicacaoUtenteService.listarPorUtente(id_utente);
            return res.json(medicacoes);
        } catch (err: any) {
            return res.status(500).json({ erro: 'Erro ao listar prescrições do utente' });
        }
    },

    // GET /medicacao-utente/ativas/:id_utente
    listarAtivasPorUtente: async (req: Request, res: Response) => {
        try {
            const utilizadorLogado = req.user!;
            const id_utente = Number(req.params.id_utente);

            if (!id_utente) return res.status(400).json({ erro: 'O parâmetro id_utente na URL é obrigatório.' });

            // 🛡️ BARREIRA DE SEGURANÇA: Validar acessos cruzados
            if (utilizadorLogado.tipo_utilizador === 'utente') {
                const utenteDados = await utenteRepo.findOne({ where: { utilizador: { id: utilizadorLogado.id } } });
                if (!utenteDados || utenteDados.id !== id_utente) {
                    return res.status(403).json({ erro: 'Acesso negado. Não pode consultar medicações de outros utentes.' });
                }
            } else if (utilizadorLogado.tipo_utilizador === 'medico') {
                const utenteAlvo = await utenteRepo.findOne({ where: { id: id_utente }, relations: ['medico'] });
                if (!utenteAlvo) return res.status(404).json({ erro: 'Utente não encontrado.' });
                
                const medicoLogado = await medicoRepo.findOne({ where: { utilizador: { id: utilizadorLogado.id } } });
                if (!medicoLogado || !utenteAlvo.medico || utenteAlvo.medico.id !== medicoLogado.id) {
                    return res.status(403).json({ erro: 'Acesso negado. Apenas o médico responsável pode consultar esta ficha clínica.' });
                }
            }

            const medicacoes = await MedicacaoUtenteService.listarAtivasPorUtente(id_utente);
            return res.json(medicacoes);
        } catch (err: any) {
            return res.status(500).json({ erro: 'Erro ao listar prescrições ativas' });
        }
    },

    // GET /medicacao-utente/emitidas/:id_medico
    listarPorMedico: async (req: Request, res: Response) => {
        try {
            const utilizadorLogado = req.user!;
            
            // 🚨 CORREÇÃO: Resolve o ID do Médico a partir do Utilizador Autenticado
            const medicoPerfil = await medicoRepo.findOne({ where: { utilizador: { id: utilizadorLogado.id } } });
            if (!medicoPerfil) {
                return res.status(404).json({ erro: 'Perfil de médico não encontrado para esta conta.' });
            }

            const medicacoes = await MedicacaoUtenteService.listarPorMedico(medicoPerfil.id);
            return res.json(medicacoes);
        } catch (err: any) {
            return res.status(500).json({ erro: 'Erro ao listar prescrições do médico' });
        }
    },

    // POST /medicacao-utente/:id_utente
    criar: async (req: Request, res: Response) => {
        try {
            const id_utilizador_logado = req.user!.id; 
            const id_utente_alvo = Number(req.params.id_utente); 
            const { id_medicacao, frequencia, data_inicio, duracao, dosagem } = req.body;

            if (!id_utente_alvo) return res.status(400).json({ erro: 'O parâmetro id_utente na URL é obrigatório.' });
            if (!id_medicacao) return res.status(400).json({ erro: 'O campo id_medicacao no corpo do pedido é obrigatório.' });

            // 🚨 CORREÇÃO: Resgatar o ID real do Médico clínico
            const medicoPerfil = await medicoRepo.findOne({ where: { utilizador: { id: id_utilizador_logado } } });
            if (!medicoPerfil) return res.status(404).json({ erro: 'Perfil médico do requisitante não encontrado.' });

            const utenteAlvo = await utenteRepo.findOne({
                where: { id: id_utente_alvo },
                relations: ['medico']
            });

            if (!utenteAlvo) return res.status(404).json({ erro: 'Utente não encontrado no sistema.' });

            if (!utenteAlvo.medico || utenteAlvo.medico.id !== medicoPerfil.id) {
                return res.status(403).json({ 
                    erro: 'Acesso negado. Apenas o médico responsável por este utente pode emitir novas prescrições.' 
                });
            }

            const novaPrescricao = await MedicacaoUtenteService.criar({
                utente: { id: id_utente_alvo },
                medico: { id: medicoPerfil.id }, // Passado o ID correto do Médico
                medicacao: { id: Number(id_medicacao) },
                frequencia,
                data_inicio,
                duracao,
                dosagem
            }, id_utilizador_logado);

            return res.status(201).json(novaPrescricao);
        } catch (err: any) {
            return res.status(500).json({ erro: 'Erro ao criar prescrição médica.' });
        }
    },

    // PATCH /medicacao-utente/:id
    atualizar: async (req: Request, res: Response) => {
        try {
            const id_utilizador_logado = req.user!.id;
            const id_prescricao = Number(req.params.id);
            
            const medicoPerfil = await medicoRepo.findOne({ where: { utilizador: { id: id_utilizador_logado } } });
            if (!medicoPerfil) return res.status(404).json({ erro: 'Perfil médico não encontrado.' });

            const prescricaoOriginal = await MedicacaoUtenteService.buscarPorId(id_prescricao);
            if (!prescricaoOriginal) return res.status(404).json({ erro: 'Prescrição não encontrada' });
            
            if (prescricaoOriginal.medico.id !== medicoPerfil.id) {
                return res.status(403).json({ erro: 'Apenas o médico que prescreveu pode alterar estes dados.' });
            }

            const atualizada = await MedicacaoUtenteService.atualizar(id_prescricao, req.body, id_utilizador_logado);
            return res.json(atualizada);
        } catch (err: any) {
            return res.status(500).json({ erro: 'Erro ao atualizar prescrição' });
        }
    },

    // PATCH /medicacao-utente/:id/encerrar
    encerrar: async (req: Request, res: Response) => {
        try {
            const id_utilizador_logado = req.user!.id;
            const id_prescricao = Number(req.params.id);

            const medicoPerfil = await medicoRepo.findOne({ where: { utilizador: { id: id_utilizador_logado } } });
            if (!medicoPerfil) return res.status(404).json({ erro: 'Perfil médico não encontrado.' });

            const prescricaoOriginal = await MedicacaoUtenteService.buscarPorId(id_prescricao);
            if (!prescricaoOriginal) return res.status(404).json({ erro: 'Prescrição não encontrada' });
            
            if (prescricaoOriginal.medico.id !== medicoPerfil.id) {
                return res.status(403).json({ erro: 'Apenas o médico responsável pode encerrar esta prescrição.' });
            }

            const encerrada = await MedicacaoUtenteService.encerrar(id_prescricao, id_utilizador_logado);
            return res.json(encerrada);
        } catch (err: any) {
            return res.status(500).json({ erro: 'Erro ao encerrar prescrição' });
        }
    }
};