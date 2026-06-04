import { Request, Response } from 'express';
import { CaratService } from '../services/carat.service';
import { AppDataSource } from '../database/database';
import { Utente } from '../models/utente.entity';
import { Tipo_Utilizador } from '../models/utilizador.entity';

const utenteRepo = AppDataSource.getRepository(Utente);

export const CaratController = {

    // RF16 — Retorna o questionário ativo com questões e opções
    getQuestionarioAtivo: async (req: Request, res: Response) => {
        try {
            // 1. Chamas o teu serviço que vai à Base de Dados buscar o questionário
            const questionario = await CaratService.obterQuestionarioAtivo();

            // 2. Se não existir nenhum questionário ativo no sistema, avisas o Frontend
            if (!questionario) {
                return res.status(404).json({ erro: 'Nenhum questionário CARAT ativo foi encontrado.' });
            }

            // 3. Se correr bem, devolves o questionário com o status 200 (OK)
            return res.json(questionario);

        } catch (err: any) {
            // Como a ordem (req, res) já está certa, o res.status já não vai falhar!
            return res.status(500).json({ erro: 'Erro interno ao obter o questionário ativo.' });
        }
    },

    // POST /carat/avaliacoes
    // RF17, RF18, RF19, RF20, RF21, RF25, RF26 — Utente submete respostas
    submeterAvaliacao: async (req: Request, res: Response) => {
        const id_utilizador_sessao = req.user!.id; 
        const { respostas } = req.body; 

        if (!Array.isArray(respostas) || respostas.length === 0) {
            return res.status(400).json({ erro: 'O campo respostas deve ser um array não vazio.' });
        }
        
        try {
            const utenteDados = await utenteRepo.findOne({ 
                where: { utilizador: { id: id_utilizador_sessao } } 
            });

            if (!utenteDados) {
                return res.status(404).json({ erro: 'Perfil de utente não associado a este utilizador.' });
            }

            const resultado = await CaratService.submeterAvaliacao(utenteDados.id, { respostas });
            return res.status(201).json(resultado);

        } catch (err: any) {
            if (err.code === 'RESPOSTAS_INCOMPLETAS') {
                return res.status(422).json({
                    erro: err.message,
                    questoesPorResponder: err.questoesPorResponder,
                });
            }
            return res.status(400).json({ erro: err.message || 'Erro ao submeter avaliação.' });
        }
    },

    obterDadosGrafico: async (req: Request, res: Response) => {
        try {
            const utilizadorLogado = req.user!;
            let idUtenteAlvo: number;

            if (utilizadorLogado.tipo_utilizador == Tipo_Utilizador.UTENTE) {
                // Se for utente, ignora qualquer ID da URL e usa o seu próprio ID da sessão
                idUtenteAlvo = utilizadorLogado.id;
            } else if (utilizadorLogado.tipo_utilizador === Tipo_Utilizador.MEDICO) {
                // Se for médico, vai buscar o ID do utente aos parâmetros da rota
                idUtenteAlvo = Number(req.params.id_utente);
                if (!idUtenteAlvo) return res.status(400).json({ erro: 'ID do utente em falta.' });
            } else {
                return res.status(403).json({ erro: 'Não autorizado.' });
            }

            const dadosGrafico = await CaratService.obterHistoricoGrafico(idUtenteAlvo);
            return res.json(dadosGrafico);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao gerar dados do gráfico.' });
        }
    },

    // RF22 — Histórico de avaliações do utente
    getAvaliacoesUtente: async (req: Request, res: Response) => {
        try {
            const id_utente = Number(req.params.id_utente);
            if (!id_utente) return res.status(400).json({ erro: 'ID do utente inválido.' });

            const avaliacoes = await CaratService.listarAvaliacoesUtente(id_utente);
            return res.json(avaliacoes);
        } catch (err: any) {
            return res.status(500).json({ erro: 'Erro ao listar avaliações do utente.' });
        }
    },

    // RF22, RF27 — Detalhe de uma avaliação (score + respostas + recomendações)
    // RF22, RF27 — Detalhe de uma avaliação (score + respostas + recomendações)
    getDetalheAvaliacao: async (req: Request, res: Response) => {
        try {
            const utilizadorLogado = req.user!;
            let id_utente_sessao: number | undefined = undefined;

            if (utilizadorLogado.tipo_utilizador === Tipo_Utilizador.UTENTE) {
                const utenteDados = await utenteRepo.findOne({ 
                    where: { utilizador: { id: utilizadorLogado.id } } 
                });

                if (!utenteDados) {
                    return res.status(404).json({ erro: 'Perfil de utente não encontrado.' });
                }
                id_utente_sessao = utenteDados.id;
            }

            const detalhe = await CaratService.detalheAvaliacao(Number(req.params.id), id_utente_sessao);
            if (!detalhe) {
                return res.status(404).json({ erro: 'Avaliação não encontrada ou sem permissão de acesso.' });
            }

            if (utilizadorLogado.tipo_utilizador === Tipo_Utilizador.MEDICO) {
                const idUtenteDono = detalhe.id_utente; 
                const utenteClinico = await utenteRepo.findOne({
                    where: { id: idUtenteDono },
                    relations: ['medico'] 
                });

                if (!utenteClinico || utenteClinico.medico.id !== utilizadorLogado.id) {
                    return res.status(403).json({ erro: 'Acesso negado. Não é o médico responsável por este utente.' });
                }
            }

            return res.json(detalhe);

        } catch (err: any) {
            if (err.code === 'FORBIDDEN') return res.status(403).json({ erro: err.message });
            return res.status(500).json({ erro: 'Erro ao obter detalhe da avaliação.' });
        }
    },

    // RF23 — Histórico de avaliações de um utente (visão médico)
    getAvaliacoesMedico: async (req: Request, res: Response) => {
        try {
            const id_medico = req.user!.id;
            const id_utente = Number(req.params.id_utente);
            const avaliacoes = await CaratService.listarAvaliacoesMedico(id_utente, id_medico);
            res.json(avaliacoes);
        } catch (err: any) {
            if (err.code === 'FORBIDDEN') return res.status(403).json({ erro: err.message });
            res.status(500).json({ erro: 'Erro ao listar avaliações.' });
        }
    },

    // RF27, RF28 — Listar recomendações de uma avaliação
    getRecomendacoes: async (req: Request, res: Response) => {
        try {
            const recomendacoes = await CaratService.listarRecomendacoes(Number(req.params.id));
            res.json(recomendacoes);
        } catch (err: any) {
            res.status(500).json({ erro: 'Erro ao listar recomendações.' });
        }
    },

    // RF24 — Criar questionário (Administrador)
    criarQuestionario: async (req: Request, res: Response) => {
        try {
            const { versao, data_ativacao } = req.body;
            if (!versao || !data_ativacao) return res.status(400).json({ erro: 'versao e data_ativacao são obrigatórias.' });

            const questionario = await CaratService.criarQuestionario({ versao, data_ativacao });
            return res.status(201).json(questionario);
        } catch (err: any) {
            return res.status(409).json({ erro: err.message });
        }
    },

    // RF24 — Desativar questionário (Administrador)
    desativarQuestionario: async (req: Request, res: Response) => {
        try {
            const questionario = await CaratService.desativarQuestionario(Number(req.params.id));
            res.json(questionario);
        } catch (err: any) {
            res.status(400).json({ erro: err.message });
        }
    },

    // RF24 — Criar questão (Administrador)
    criarQuestao: async (req: Request, res: Response) => {
        try {
            const { id_questionario, texto_questao } = req.body;
            if (!id_questionario || !texto_questao) return res.status(400).json({ erro: 'id_questionario e texto_questao são obrigatórios.' });

            const questao = await CaratService.criarQuestao({ id_questionario, texto_questao });
            return res.status(201).json(questao);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    },

    // RF24 — Criar opção de resposta (Administrador)
    criarOpcaoResposta: async (req: Request, res: Response) => {
        try {
            const { id_questao, texto_opcao, score } = req.body;
            if (!id_questao || !texto_opcao || score === undefined) return res.status(400).json({ erro: 'id_questao, texto_opcao e score são obrigatórios.' });

            const opcao = await CaratService.criarOpcaoResposta({ id_questao, texto_opcao, score });
            return res.status(201).json(opcao);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    },
};