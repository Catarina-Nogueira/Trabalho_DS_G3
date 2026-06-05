import { Request, Response } from 'express';
import { AlertaService } from '../services/alerta.services';
import { EstadoAlerta, PrioridadeAlerta } from '../models/alerta.entity';
import { AppDataSource } from '../database/database';
import { Utente } from '../models/utente.entity';
import { Medico } from '../models/medico.entity';

const utenteRepo = AppDataSource.getRepository(Utente);

export const AlertaController = {

    // RF36 - Listagem de alertas direcionados ao Médico autenticado
    listarPorMedico: async (req: Request, res: Response) => {
        try {
            const { estado, prioridade, id_utente } = req.query;

            const medico = await AppDataSource
                .getRepository(Medico)
                .findOne({
                    where: {
                        utilizador: {
                            id: req.user!.id
                        }
                    }
                });

            if (!medico) {
                return res.status(404).json({
                    erro: 'Médico não encontrado.'
                });
            }

            const alertas = await AlertaService.listarPorMedico(
                medico.id,
                estado as EstadoAlerta,
                prioridade as PrioridadeAlerta,
                id_utente ? Number(id_utente) : undefined
            );

            console.log("Médico:", medico.id);
            console.log("Alertas encontrados:", alertas.length);

            return res.json(alertas);

        } catch (err: any) {
            console.error(err);
            return res.status(500).json({
                erro: 'Erro ao listar alertas do médico.'
            });
        }
    },

    // RF38 - Consulta de alertas pelo utente autenticado
    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const utilizadorLogado = req.user!;

            const utenteDados = await utenteRepo.findOne({ 
                where: { utilizador: { id: utilizadorLogado.id } } 
            });

            if (!utenteDados) {
                return res.status(404).json({ erro: 'Perfil clínico de utente não encontrado para esta conta.' });
            }

            const alertas = await AlertaService.listarPorUtente(utenteDados.id);
            return res.json(alertas);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao listar alertas do utente.' });
        }
    },

    // Consulta de Alerta por ID com segurança corrigida para avaliações e sintomas
    buscarPorId: async (req: Request, res: Response) => {
        try {
            const alerta = await AlertaService.buscarPorId(Number(req.params.id));
            
            if (!alerta) {
                return res.status(404).json({ erro: 'Alerta não encontrado.' });
            }
            
            // O alerta aponta sempre para o utente e médico diretamente na raiz (Eager Load)
            const idUtenteDono = alerta.utente.id;
            const idMedicoResponsavel = alerta.medico.id;

            // Validação de Permissão para Utente
            if (req.user!.tipo_utilizador === 'utente') {
                const utenteDados = await utenteRepo.findOne({ where: { utilizador: { id: req.user!.id } } });
                
                if (!utenteDados || idUtenteDono !== utenteDados.id) {
                    return res.status(403).json({ erro: 'Não tem permissão para visualizar este alerta.' });
                }
            }
            
            // Validação de Permissão para Médico
            if (req.user!.tipo_utilizador === 'medico' && idMedicoResponsavel !== req.user!.id_perfil_especifico) {
                return res.status(403).json({ erro: 'Este alerta pertence a um utente associado a outro médico.' });
            }

            return res.json(alerta);
        } catch (err: any) {
            return res.status(500).json({ erro: 'Erro ao procurar o alerta especificado.' });
        }
    },

    // RF34 - Atualização do estado do alerta (Apenas Médicos Responsáveis)
    atualizarEstado: async (req: Request, res: Response) => {
        try {
            const { estado } = req.body;
            const id_alerta = Number(req.params.id);

            const alertaOriginal = await AlertaService.buscarPorId(id_alerta);
            
            if (!alertaOriginal) {
                return res.status(404).json({ erro: 'Alerta não encontrado no sistema.' });
            }

            // Validação limpa: o médico associado ao alerta coincide com o médico autenticado?
            if (alertaOriginal.medico.id !== req.user!.id) {
                return res.status(403).json({ erro: 'Apenas o médico responsável pode alterar o estado deste alerta.' });
            }

            const alertaAtualizado = await AlertaService.atualizarEstado(id_alerta, { estado }, req.user!.id);
            return res.json(alertaAtualizado);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message || 'Erro ao atualizar estado do alerta.' });
        }
    }
};