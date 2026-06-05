import { Request, Response } from 'express';
import { ExameUtenteService } from '../services/exameUtente.services';
import { AppDataSource } from '../database/database';
import { Utente } from '../models/utente.entity';
import { Medico } from '../models/medico.entity';
import { CriarExameUtenteDTO, RegistarResultadoExameDTO } from '../dtos/exameUtente.dto';

const utenteRepo = AppDataSource.getRepository(Utente);
const medicoRepo = AppDataSource.getRepository(Medico);

// Função auxiliar movida para fora com tipagem explícita e imports limpos
async function validarAcessoFichaUtente(utilizadorLogado: any, idUtenteUrl: number): Promise<{ valido: boolean; erro?: string; status?: number }> {
    if (utilizadorLogado.tipo_utilizador === 'utente') {
        const utenteDados = await utenteRepo.findOne({ where: { utilizador: { id: utilizadorLogado.id } } });
        if (!utenteDados || utenteDados.id !== idUtenteUrl) {
            return { valido: false, erro: 'Acesso negado. Não pode consultar exames de outros utentes.', status: 403 };
        }
    } else if (utilizadorLogado.tipo_utilizador === 'medico') {
        const utenteAlvo = await utenteRepo.findOne({ where: { id: idUtenteUrl }, relations: ['medico'] });
        if (!utenteAlvo) {
            return { valido: false, erro: 'Utente não encontrado no sistema.', status: 404 };
        }

        const medicoLogado = await medicoRepo.findOne({ where: { utilizador: { id: utilizadorLogado.id } } });
        if (!medicoLogado || !utenteAlvo.medico || utenteAlvo.medico.id !== medicoLogado.id) {
            return { valido: false, erro: 'Acesso negado. Apenas o médico responsável por este utente pode consultar este histórico.', status: 403 };
        }
    }
    return { valido: true };
}

export const ExameUtenteController = {

    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const id_utente = Number(req.params.id_utente);
            if (isNaN(id_utente) || id_utente <= 0) return res.status(400).json({ erro: 'ID do utente inválido.' });

            const controlo = await validarAcessoFichaUtente(req.user!, id_utente);
            if (!controlo.valido) return res.status(controlo.status!).json({ erro: controlo.erro });

            const exames = await ExameUtenteService.listarPorUtente(id_utente);
            return res.json(exames);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao listar exames do utente' });
        }
    },

    listarPendentesPorUtente: async (req: Request, res: Response) => {
        try {
            const id_utente = Number(req.params.id_utente);
            if (isNaN(id_utente) || id_utente <= 0) return res.status(400).json({ erro: 'ID do utente inválido.' });

            const controlo = await validarAcessoFichaUtente(req.user!, id_utente);
            if (!controlo.valido) return res.status(controlo.status!).json({ erro: controlo.erro });

            const exames = await ExameUtenteService.listarPendentesPorUtente(id_utente);
            return res.json(exames);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao listar exames pendentes' });
        }
    },

    listarPorMedico: async (req: Request, res: Response) => {
        try {
            const id_utilizador = req.user!.id; 
            
            // 🚨 CORREÇÃO: Mapear o id do Utilizador para o Perfil do Médico real
            const medicoPerfil = await medicoRepo.findOne({ where: { utilizador: { id: id_utilizador } } });
            if (!medicoPerfil) return res.status(404).json({ erro: 'Perfil médico não localizado.' });

            const exames = await ExameUtenteService.listarPorMedico(medicoPerfil.id);
            return res.json(exames);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao listar exames do médico' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id) || id <= 0) return res.status(400).json({ erro: 'ID de requisição inválido.' });

            const exame = await ExameUtenteService.buscarPorId(id);
            if (!exame) return res.status(404).json({ erro: 'Exame não encontrado' });

            const utilizadorLogado = req.user!;

            if (utilizadorLogado.tipo_utilizador === 'utente') {
                const utentePerfil = await utenteRepo.findOne({ where: { utilizador: { id: utilizadorLogado.id } } });
                if (!utentePerfil || exame.utente.id !== utentePerfil.id) {
                    return res.status(403).json({ erro: 'Não tem permissão para consultar este exame.' });
                }
            }
            
            if (utilizadorLogado.tipo_utilizador === 'medico') {
                const medicoPerfil = await medicoRepo.findOne({ where: { utilizador: { id: utilizadorLogado.id } } });
                if (!medicoPerfil || exame.medico.id !== medicoPerfil.id) {
                    return res.status(403).json({ erro: 'Acesso negado. Este exame pertence à carteira de outro clínico.' });
                }
            }

            return res.json(exame);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao buscar exame' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const id_utilizador_medico = req.user!.id;
            const id_utente_alvo = Number(req.params.id_utente); 
            const { id_exame, data_exame } = req.body;

            if (isNaN(id_utente_alvo) || id_utente_alvo <= 0) return res.status(400).json({ erro: 'O parâmetro id_utente na URL é inválido.' });
            if (!id_exame || !data_exame) return res.status(400).json({ erro: 'Campos obrigatórios em falta (id_exame, data_exame).' });

            // 🚨 CORREÇÃO: Resgatar o perfil clínico real do médico logado
            const medicoPerfil = await medicoRepo.findOne({ where: { utilizador: { id: id_utilizador_medico } } });
            if (!medicoPerfil) return res.status(404).json({ erro: 'Perfil médico do requisitante não encontrado.' });

            const utenteAlvo = await utenteRepo.findOne({
                where: { id: id_utente_alvo },
                relations: ['medico']
            });

            if (!utenteAlvo) return res.status(404).json({ erro: 'Utente não encontrado no sistema.' });
            
            if (!utenteAlvo.medico || utenteAlvo.medico.id !== medicoPerfil.id) {
                return res.status(403).json({ erro: 'Acesso negado. Apenas o médico responsável por este utente pode prescrever exames.' });
            }

            const dadosDTO: CriarExameUtenteDTO = {
                utente: { id: id_utente_alvo },
                medico: { id: medicoPerfil.id },
                exame: { id: Number(id_exame) },
                data_exame
            };

            const novoExame = await ExameUtenteService.criar(dadosDTO, req.user!.id);
            return res.status(201).json(novoExame);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao prescrever exame' });
        }
    },

    registarResultado: async (req: Request, res: Response) => {
        try {
            const id_requisicao = Number(req.params.id);
            if (isNaN(id_requisicao) || id_requisicao <= 0) return res.status(400).json({ erro: 'ID de requisição inválido.' });

            const medicoPerfil = await medicoRepo.findOne({ where: { utilizador: { id: req.user!.id } } });
            if (!medicoPerfil) return res.status(404).json({ erro: 'Perfil médico não identificado.' });

            const exameOriginal = await ExameUtenteService.buscarPorId(id_requisicao);
            if (!exameOriginal) return res.status(404).json({ erro: 'Exame não encontrado.' });
            
            if (exameOriginal.medico.id !== medicoPerfil.id) {
                return res.status(403).json({ erro: 'Apenas o médico que prescreveu o exame pode registar resultados.' });
            }

            const dadosDTO: RegistarResultadoExameDTO = req.body;
            if (!dadosDTO.resultado || !dadosDTO.interpretacao) {
                return res.status(400).json({ erro: 'Resultado e interpretação clínica são obrigatórios.' });
            }

            const examenAtualizado = await ExameUtenteService.registarResultado(id_requisicao, dadosDTO, req.user!.id);
            return res.json(examenAtualizado);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao registar resultado do exame' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            const id_requisicao = Number(req.params.id);
            if (isNaN(id_requisicao) || id_requisicao <= 0) return res.status(400).json({ erro: 'ID de requisição inválido.' });

            const medicoPerfil = await medicoRepo.findOne({ where: { utilizador: { id: req.user!.id } } });
            if (!medicoPerfil) return res.status(404).json({ erro: 'Perfil médico não identificado.' });

            const exameOriginal = await ExameUtenteService.buscarPorId(id_requisicao);
            if (!exameOriginal) return res.status(404).json({ erro: 'Exame não encontrado.' });
            
            if (exameOriginal.medico.id !== medicoPerfil.id) {
                return res.status(403).json({ erro: 'Apenas o médico que requisitou pode eliminar este exame.' });
            }

            await ExameUtenteService.eliminar(id_requisicao, req.user!.id);
            return res.status(204).send();
        } catch (err: any) {
            return res.status(400).json({ erro: err.message || 'Erro ao eliminar exame' });
        }
    }
};