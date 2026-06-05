import { Request, Response } from 'express';
import { UtenteService } from '../services/utente.services';
import { CriarUtenteDTO, AtualizarUtenteDTO } from '../dtos/utente.dto';

export const UtenteController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const utentes = await UtenteService.listarTodos();
            return res.json(utentes);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar utentes.' });
        }
    },

    listarPorMedico: async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    erro: 'Utilizador não autenticado na sessão.'
                });
            }

            if (req.user.tipo_utilizador !== 'medico') {
                return res.status(403).json({
                    erro: 'Apenas médicos podem consultar esta listagem.'
                });
            }

            const id_medico = req.user.id_perfil_especifico;

            if (!id_medico) {
                return res.status(400).json({
                    erro: 'ID do médico não encontrado na sessão.'
                });
            }

            console.log('[DEBUG] Médico autenticado:', id_medico);

            const utentes = await UtenteService.listarPorMedico(id_medico);

            return res.json(utentes);

        } catch (err: any) {
            console.error(err);

            return res.status(500).json({
                erro: err.message || 'Erro ao listar utentes do médico.'
            });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ erro: 'Utilizador não autenticado na sessão.' });
            }

            const utilizadorLogado = req.user;
            const id_utente = Number(req.params.id);

            const utente = await UtenteService.buscarPorId(id_utente);
            if (!utente) return res.status(404).json({ erro: 'Utente não encontrado.' });

            // BARREIRA DE SEGURANÇA: Bloqueia médicos intrusos
            if (utilizadorLogado.tipo_utilizador === 'medico' && utente.medico.id !== utilizadorLogado.id_perfil_especifico) {
                return res.status(403).json({ erro: 'Acesso negado. Este utente não está sob a sua tutela clínica.' });
            }

            return res.json(utente);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao buscar utente.' });
        }
    },

    buscarDadosPermitidos: async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ erro: 'Utilizador não autenticado na sessão.' });
            }

            const utilizadorLogado = req.user;
            const id_utente = Number(req.params.id);

            const utente = await UtenteService.buscarDadosPermitidos(id_utente);
            if (!utente) return res.status(404).json({ erro: 'Utente não encontrado.' });

            // BARREIRA DE SEGURANÇA: Utente só vê ele próprio, Médico só vê os seus utentes
            if (utilizadorLogado.tipo_utilizador === 'utente' && utente.utilizador.id !== utilizadorLogado.id) {
                return res.status(403).json({ erro: 'Acesso negado. Não pode ver dados de outros utentes.' });
            }
            if (utilizadorLogado.tipo_utilizador === 'medico' && utente.medico.id !== utilizadorLogado.id_perfil_especifico) {
                return res.status(403).json({ erro: 'Acesso negado. Este utente não está sob a sua tutela clínica.' });
            }

            const { utilizador, medico, ...dadosLimpos } = utente as Record<string, any>;
            return res.json(dadosLimpos);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao buscar dados do utente.' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ erro: 'Utilizador não autenticado na sessão.' });
            }

            const id_utilizador_logado = req.user.id; 
            const id_utilizador = Number(req.params.id_utilizador);
            const { nome, data_nascimento, sexo_biologico, id_medico } = req.body;

            if (!id_utilizador) return res.status(400).json({ erro: 'O parâmetro id_utilizador na URL é obrigatório.' });
            if (!nome) return res.status(400).json({ erro: 'O campo nome é obrigatório.' });
            if (!data_nascimento) return res.status(400).json({ erro: 'O campo data_nascimento é obrigatório.' });
            if (!sexo_biologico) return res.status(400).json({ erro: 'O campo sexo_biologico é obrigatório.' });
            if (!id_medico) return res.status(400).json({ erro: 'O campo id_medico é obrigatório.' });

            const dadosDTO: CriarUtenteDTO = { nome, data_nascimento, sexo_biologico };

            const utente = await UtenteService.criar(dadosDTO, id_utilizador, Number(id_medico), id_utilizador_logado);
            return res.status(201).json(utente);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const dados: AtualizarUtenteDTO = req.body;
            const utilizadorSessao = req.user;
            
            if (!utilizadorSessao) {
                return res.status(401).json({ erro: 'Utilizador não autenticado na sessão.' });
            }
               
            const utente = await UtenteService.atualizar(id, dados, utilizadorSessao);
            if (!utente) return res.status(404).json({ erro: 'Utente não encontrado.' });
            return res.json(utente);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ erro: 'Utilizador não autenticado na sessão.' });
            }

            const id_utilizador_logado = req.user.id;
            const id_alvo = Number(req.params.id);

            await UtenteService.eliminar(id_alvo, id_utilizador_logado);
            return res.status(204).send();
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    },
};