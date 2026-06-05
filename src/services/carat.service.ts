import { AppDataSource } from '../database/database';
import { Avaliacao_Carat, NivelControlo } from '../models/avaliacaoCarat.entity';
import { Resposta_Utente } from '../models/respostaUtente.entity';
import { Opcao_Resposta } from '../models/opcaoResposta.entity';
import { Questao_Carat } from '../models/questaoCarat.entity';
import { Questionario_Carat } from '../models/questionarioCarat.entity';
import { Recomendacao, TipoRecomendacao } from '../models/recomendacao.entity';
import { Utente } from '../models/utente.entity';
import { Configuracao } from '../models/configuracao.entity';
import { AlertaService } from './alerta.services';
import { TipoAlerta } from '../models/alerta.entity';
import { IsNull, LessThanOrEqual, MoreThan } from 'typeorm';

const avaliacaoRepo     = () => AppDataSource.getRepository(Avaliacao_Carat);
const opcaoRepo         = () => AppDataSource.getRepository(Opcao_Resposta);
const questaoRepo       = () => AppDataSource.getRepository(Questao_Carat);
const questionarioRepo = () => AppDataSource.getRepository(Questionario_Carat);
const recomendacaoRepo = () => AppDataSource.getRepository(Recomendacao);
const utenteRepo        = () => AppDataSource.getRepository(Utente);
const configuracaoRepo = () => AppDataSource.getRepository(Configuracao);

async function getLimiar(nome: string, fallback: number): Promise<number> {
    const cfg = await configuracaoRepo().findOne({ where: { nome_parametro: nome } });
    return cfg ? Number(cfg.valor_limiar) : fallback;
}

export const CaratService = {

    // RF16 — Carregamento atómico otimizado de Apenas 1 Query à BD
    obterQuestionarioAtivo: async () => {
        const hoje = new Date().toISOString().split('T')[0]!;

        const questionario = await questionarioRepo().findOne({
            where: [
                { data_ativacao: LessThanOrEqual(hoje), data_desativacao: IsNull() },
                { data_ativacao: LessThanOrEqual(hoje), data_desativacao: MoreThan(hoje) }
            ],
            relations: ['questoes', 'questoes.opcoes'],
            order: {
                data_ativacao: 'DESC',
                questoes: { 
                    id: 'ASC',
                    opcoes: { 
                        score: 'ASC' 
        }
    }
}
        });

        if (!questionario) throw new Error('Não existe nenhum questionário CARAT ativo.');

        return {
            id: questionario.id,
            versao: questionario.versao,
            data_ativacao: questionario.data_ativacao,
            questoes: questionario.questoes.map((q) => ({
                id: q.id,
                texto_questao: q.texto_questao,
                opcoes: q.opcoes.map((o) => ({
                    id: o.id,
                    texto_opcao: o.texto_opcao,
                    score: o.score,
                })),
            })),
        };
    },

    // RF17 a RF26 — Processamento sob Transação de Segurança Estrita
    submeterAvaliacao: async (id_utente: number, dto: { respostas: { id_questao: number; id_opcao: number }[] }) => {
        const utente = await utenteRepo().findOne({ where: { id: id_utente }, relations: ['medico'] });
        if (!utente) throw new Error('Utente não encontrado.');

        const hoje = new Date().toISOString().split('T')[0]!;
        const questionarioActive = await questionarioRepo().findOne({
            where: [
                { data_ativacao: LessThanOrEqual(hoje), data_desativacao: IsNull() },
                { data_ativacao: LessThanOrEqual(hoje), data_desativacao: MoreThan(hoje) }
            ],
            order: { data_ativacao: 'DESC' }
        });

        if (!questionarioActive) {
            throw new Error('Não existe nenhum questionário CARAT ativo no sistema.');
        }

        const todasQuestoes = await questaoRepo().find({ where: { questionario: { id: questionarioActive.id } } });
        const questoesRespondidas = new Set(dto.respostas.map((r) => r.id_questao));
        const questoesPorResponder = todasQuestoes
            .filter((q) => !questoesRespondidas.has(q.id))
            .map((q) => ({ id: q.id, texto: q.texto_questao }));

        if (questoesPorResponder.length > 0) {
            throw Object.assign(new Error('Existem questões por responder.'), { 
                code: 'RESPOSTAS_INCOMPLETAS', 
                questoesPorResponder 
            });
        }

        const opcoes = await opcaoRepo().find({
            where: dto.respostas.map((r) => ({ id: r.id_opcao })),
            relations: ['questao'],
        });
        const opcaoMap = new Map(opcoes.map((o) => [o.id, o]));

        for (const resposta of dto.respostas) {
            const opcao = opcaoMap.get(resposta.id_opcao);
            if (!opcao) throw new Error(`Opção ${resposta.id_opcao} não encontrada.`);
            if (opcao.questao.id !== resposta.id_questao) {
                throw new Error(`A opção ${resposta.id_opcao} não pertence à questão ${resposta.id_questao}.`);
            }
        }

        const score_total = opcoes.reduce((acc, o) => acc + o.score, 0);
        const limiarControlado = await getLimiar('limiar_controlado', 24);
        const limiarParcial = await getLimiar('limiar_parcial', 20);

        let nivel_controlo: NivelControlo = NivelControlo.NAO_CONTROLADO;
        if (score_total >= limiarControlado) nivel_controlo = NivelControlo.CONTROLADO;
        else if (score_total >= limiarParcial) nivel_controlo = NivelControlo.PARCIALMENTE_CONTROLADO;

        const avaliacaoAnterior = await avaliacaoRepo().findOne({
            where: { utente: { id: id_utente } },
            order: { data_avaliacao: 'DESC' },
        });
        const delta = avaliacaoAnterior ? score_total - avaliacaoAnterior.score_total : null;

        // Execução Atómica via Transação Nativa do TypeORM
        return await AppDataSource.transaction(async (transactionalEntityManager) => {
            const novaAvaliacao = transactionalEntityManager.create(Avaliacao_Carat, {
                utente,
                medico: utente.medico,
                questionario: questionarioActive,
                score_total,
                nivel_controlo,
            });
            const avaliacaoGuardada = await transactionalEntityManager.save(novaAvaliacao);

            if (nivel_controlo === NivelControlo.NAO_CONTROLADO) {
                await AlertaService.gerarAlertaAutomatico(id_utente, utente.medico.id, TipoAlerta.SCORE_CARAT, 
                    `Crítico: Utente com score ${score_total} (Não Controlado).`, avaliacaoGuardada.id);
            } else if (nivel_controlo === NivelControlo.PARCIALMENTE_CONTROLADO) {
                await AlertaService.gerarAlertaAutomatico(id_utente, utente.medico.id, TipoAlerta.SCORE_CARAT, 
                    `Aviso: Utente com score ${score_total} (Parcialmente Controlado).`, avaliacaoGuardada.id);
            }

            if (delta !== null) {
                const limiarDeterioracao = await getLimiar('limiar_deterioracao', 3);
                if (delta <= -limiarDeterioracao) {
                    await AlertaService.gerarAlertaAutomatico(id_utente, utente.medico.id, TipoAlerta.SCORE_CARAT, 
                        `Deterioração: Queda abrupta de ${Math.abs(delta)} pontos no teste CARAT.`, avaliacaoGuardada.id);
                }
            }

            const respostasEntidades = dto.respostas.map((r) =>
                transactionalEntityManager.create(Resposta_Utente, { avaliacao: avaliacaoGuardada, opcao: opcaoMap.get(r.id_opcao)! })
            );
            await transactionalEntityManager.save(respostasEntidades);

            const recomendacoes = await CaratService.gerarRecomendacoesEmTransacao(transactionalEntityManager, avaliacaoGuardada, nivel_controlo, delta);

            return {
                avaliacao: {
                    id: avaliacaoGuardada.id,
                    data_avaliacao: avaliacaoGuardada.data_avaliacao,
                    score_total,
                    nivel_controlo,
                    delta,
                    id_questionario_utilizado: questionarioActive.id
                },
                recomendacoes: recomendacoes.map((r) => ({
                    id: r.id,
                    tipo: r.tipo_recomedacao,
                    texto: r.texto_recomendacao,
                    data_criacao: r.data_criacao,
                })),
            };
        });
    },

    gerarRecomendacoesEmTransacao: async (em: any, avaliacao: Avaliacao_Carat, nivel: NivelControlo, delta: number | null): Promise<Recomendacao[]> => {
        const limiarDeterioracao = await getLimiar('limiar_deterioracao', 3);
        const novasRecomendacoes: Partial<Recomendacao>[] = [];

        if (nivel === NivelControlo.CONTROLADO) {
            novasRecomendacoes.push({ avaliacao, tipo_recomedacao: TipoRecomendacao.MONITORIZACAO, texto_recomendacao: 'A sua doença está controlada. Continue o plano atual e repita a avaliação em 4 semanas.' });
        } else if (nivel === NivelControlo.PARCIALMENTE_CONTROLADO) {
            novasRecomendacoes.push({ avaliacao, tipo_recomedacao: TipoRecomendacao.CONSULTA, texto_recomendacao: 'O controlo é parcial. Consulte o seu médico para rever o plano terapêutico.' });
            novasRecomendacoes.push({ avaliacao, tipo_recomedacao: TipoRecomendacao.ESTILO_VIDA, texto_recomendacao: 'Evite os seus gatilhos conhecidos e garanta adesão à medicação prescrita.' });
        } else {
            novasRecomendacoes.push({ avaliacao, tipo_recomedacao: TipoRecomendacao.INTERVENCAO_URGENTE, texto_recomendacao: 'A sua doença não está controlada. Contacte o seu médico com urgência.' });
            novasRecomendacoes.push({ avaliacao, tipo_recomedacao: TipoRecomendacao.EXAME, texto_recomendacao: 'Pode ser necessária a realização de provas de função respiratória.' });
        }

        if (delta !== null && delta <= -limiarDeterioracao) {
            novasRecomendacoes.push({ avaliacao, tipo_recomedacao: TipoRecomendacao.MEDICACAO, texto_recomendacao: `Detetou-se uma deterioração de ${Math.abs(delta)} pontos. Pode ser necessário rever a medicação.` });
        }

        const entidades = em.create(Recomendacao, novasRecomendacoes as Recomendacao[]);
        return await em.save(entidades);
    },

    listarAvaliacoesUtente: async (id_utente: number) => {
        const avaliacoes = await avaliacaoRepo().find({
            where: { utente: { id: id_utente } },
            order: { data_avaliacao: 'DESC' },
            relations: ['questionario'],
        });

        return avaliacoes.map((a) => ({
            id: a.id,
            data_avaliacao: a.data_avaliacao,
            score_total: a.score_total,
            nivel_controlo: a.nivel_controlo,
            versao_questionario: a.questionario.versao,
        }));
    },

    // RF22, RF27 — Conclusão Segura da Consulta de Detalhes
    detalheAvaliacao: async (id_avaliacao: number, id_utente?: number) => {
        const avaliacao = await avaliacaoRepo().findOne({
            where: { id: id_avaliacao },
            relations: ['utente', 'questionario', 'utente.medico'],
        });

        if (!avaliacao) throw new Error('Avaliação não encontrada.');

        if (id_utente !== undefined && avaliacao.utente.id !== id_utente) {
            throw Object.assign(new Error('Acesso não autorizado.'), { code: 'FORBIDDEN' });
        }

        const recomendacoes = await recomendacaoRepo().find({
            where: { avaliacao: { id: id_avaliacao } },
            order: { data_criacao: 'ASC' },
        });

        const respostas = await AppDataSource.getRepository(Resposta_Utente).find({
            where: { avaliacao: { id: id_avaliacao } },
            relations: ['opcao', 'opcao.questao'],
        });

        return {
            id: avaliacao.id,
            id_utente: avaliacao.utente.id,
            data_avaliacao: avaliacao.data_avaliacao,
            score_total: avaliacao.score_total,
            nivel_controlo: avaliacao.nivel_controlo,
            versao_questionario: avaliacao.questionario.versao,
            respostas: respostas.map((r) => ({
                questao: r.opcao.questao.texto_questao,
                opcao_escolhida: r.opcao.texto_opcao,
                score: r.opcao.score,
            })),
            recomendacoes: recomendacoes.map((rec) => ({
                id: rec.id,
                tipo: rec.tipo_recomedacao,
                texto: rec.texto_recomendacao,
                data_criacao: rec.data_criacao
            }))
        };
    },

    listarAvaliacoesMedico: async (id_utente: number, id_medico: number) => {
        return await avaliacaoRepo().find({
            where: { utente: { id: id_utente }, medico: { id: id_medico } },
            order: { data_avaliacao: 'DESC' },
            relations: ['questionario']
        });
    },

    listarRecomendacoes: async (id_avaliacao: number) => {
        return await recomendacaoRepo().find({
            where: { avaliacao: { id: id_avaliacao } },
            order: { data_criacao: 'DESC' }
        });
    },

    obterHistoricoGrafico: async (id_utente: number) => {
        const dados = await avaliacaoRepo().find({
            where: { utente: { id: id_utente } },
            order: { data_avaliacao: 'ASC' },
            select: ['id', 'data_avaliacao', 'score_total', 'nivel_controlo']
        });
        return dados;
    },

    criarQuestionario: async (dados: any) => {
        const questionario = questionarioRepo().create(dados);
        return await questionarioRepo().save(questionario);
    },

    desativarQuestionario: async (id: number) => {
        const q = await questionarioRepo().findOne({ where: { id } });
        if (!q) throw new Error('Questionário não encontrado.');
        q.data_desativacao = new Date().toISOString().split('T')[0]!;
        return await questionarioRepo().save(q);
    },

    criarQuestao: async (dados: any) => {
        const qRepo = AppDataSource.getRepository(Questao_Carat);
        const questao = qRepo.create({
            texto_questao: dados.texto_questao,
            questionario: { id: dados.id_questionario }
        });
        return await qRepo.save(questao);
    },

    criarOpcaoResposta: async (dados: any) => {
        const oRepo = AppDataSource.getRepository(Opcao_Resposta);
        const opcao = oRepo.create({
            texto_opcao: dados.texto_opcao,
            score: dados.score,
            questao: { id: dados.id_questao }
        });
        return await oRepo.save(opcao);
    }
};