// src/services/carat.service.ts

import { AppDataSource } from '../database/database';
import { Avaliacao_Carat, NivelControlo } from '../models/avaliacaoCarat.entity';
import { Resposta_Utente } from '../models/respostaUtente.entity';
import { Opcao_Resposta } from '../models/opcaoResposta.entity';
import { Questao_Carat } from '../models/questaoCarat.entity';
import { Questionario_Carat } from '../models/questionarioCarat.entity';
import { Recomendacao, TipoRecomendacao } from '../models/recomendacao.entity';
import { Utente } from '../models/utente.entity';
import { Configuracao } from '../models/configuracao.entity';
import { SubmeterAvaliacaoDto, CriarQuestionarioDto, CriarQuestaoDto, CriarOpcaoRespostaDto } from '../dtos/carat.dto';
import { AlertaService } from './alerta.services';
import { TipoAlerta } from '../models/alerta.entity';

// Repositórios
const avaliacaoRepo    = () => AppDataSource.getRepository(Avaliacao_Carat);
const respostaRepo     = () => AppDataSource.getRepository(Resposta_Utente);
const opcaoRepo        = () => AppDataSource.getRepository(Opcao_Resposta);
const questaoRepo      = () => AppDataSource.getRepository(Questao_Carat);
const questionarioRepo = () => AppDataSource.getRepository(Questionario_Carat);
const recomendacaoRepo = () => AppDataSource.getRepository(Recomendacao);
const utenteRepo       = () => AppDataSource.getRepository(Utente);
const configuracaoRepo = () => AppDataSource.getRepository(Configuracao);

// ---------------------------------------------------------------------------
// Limiares padrão (escala CARAT 0-30)
// Configuráveis pelo Administrador via tabela Configuracao (RF11)
// >= 12 → controlado | 6-11 → parcialmente | <= 5 → não controlado
// ---------------------------------------------------------------------------
async function getLimiar(nome: string, fallback: number): Promise<number> {
    const cfg = await configuracaoRepo().findOne({ where: { nome_parametro: nome } });
    return cfg ? Number(cfg.valor_limiar) : fallback;
}

export const CaratService = {

    // RF16 — Obter questionário CARAT ativo com questões e opções
    obterQuestionarioAtivo: async () => {
        const hoje = new Date().toISOString().split('T')[0];

        const questionario = await questionarioRepo()
            .createQueryBuilder('q')
            .where('q.data_ativacao <= :hoje', { hoje })
            .andWhere('(q.data_desativacao IS NULL OR q.data_desativacao > :hoje)', { hoje })
            .orderBy('q.data_ativacao', 'DESC')
            .getOne();

        if (!questionario) {
            throw new Error('Não existe nenhum questionário CARAT ativo.');
        }

        const questoes = await questaoRepo().find({
            where: { questionario: { id: questionario.id } },
            order: { id: 'ASC' },
        });

        const questoesComOpcoes = await Promise.all(
            questoes.map(async (q) => {
                const opcoes = await opcaoRepo().find({
                    where: { questao: { id: q.id } },
                    order: { score: 'ASC' },
                });
                return {
                    id: q.id,
                    texto_questao: q.texto_questao,
                    opcoes: opcoes.map((o) => ({
                        id: o.id,
                        texto_opcao: o.texto_opcao,
                        score: o.score,
                    })),
                };
            }),
        );

        return {
            id: questionario.id,
            versao: questionario.versao,
            data_ativacao: questionario.data_ativacao,
            questoes: questoesComOpcoes,
        };
    },

    // RF17, RF18, RF19, RF20, RF21, RF25, RF26 — Submeter avaliação CARAT
    // RF17, RF18, RF19, RF20, RF21, RF25, RF26 — Submeter avaliação CARAT
    submeterAvaliacao: async (id_utente: number, dto: { respostas: { id_questao: number; id_opcao: number }[] }) => {

        // 1. Verificar que o utente existe
        const utente = await utenteRepo().findOne({
            where: { id: id_utente },
            relations: ['medico'],
        });
        if (!utente) throw new Error('Utente não encontrado.');

        // 2. Descobrir AUTOMATICAMENTE o questionário CARAT ativo neste momento
        const hoje = new Date().toISOString().split('T')[0];
        const questionarioActive = await questionarioRepo()
            .createQueryBuilder('q')
            .where('q.data_ativacao <= :hoje', { hoje })
            .andWhere('(q.data_desativacao IS NULL OR q.data_desativacao > :hoje)', { hoje })
            .orderBy('q.data_ativacao', 'DESC')
            .getOne();

        if (!questionarioActive) {
            throw new Error('Não é possível submeter a avaliação porque não existe nenhum questionário CARAT ativo no sistema.');
        }

        // 3. RF18 — Verificar que todas as questões DO QUESTIONÁRIO ATIVO foram respondidas
        const todasQuestoes = await questaoRepo().find({
            where: { questionario: { id: questionarioActive.id } },
        });

        const questoesRespondidas = new Set(dto.respostas.map((r) => r.id_questao));
        const questoesPorResponder = todasQuestoes
            .filter((q) => !questoesRespondidas.has(q.id))
            .map((q) => ({ id: q.id, texto: q.texto_questao }));

        if (questoesPorResponder.length > 0) {
            throw Object.assign(
                new Error('Existem questões por responder.'),
                { code: 'RESPOSTAS_INCOMPLETAS', questoesPorResponder },
            );
        }

        // 4. Carregar as opções escolhidas e verificar que pertencem às questões corretas
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

        // 5. RF19 — Calcular score total
        const score_total = opcoes.reduce((acc, o) => acc + o.score, 0);

        // 6. RF20 — Determinar nível de controlo com limiares configuráveis
        const limiarControlado = await getLimiar('limiar_controlado', 24);
        const limiarParcial    = await getLimiar('limiar_parcial', 20);

        let nivel_controlo: NivelControlo;
        if (score_total >= limiarControlado) {
            nivel_controlo = NivelControlo.CONTROLADO;
        } else if (score_total >= limiarParcial) {
            nivel_controlo = NivelControlo.PARCIALMENTE_CONTROLADO;
        } else {
            nivel_controlo = NivelControlo.NAO_CONTROLADO;
        }

        // 7. RF21 — Calcular delta face à avaliação anterior
        const avaliacaoAnterior = await avaliacaoRepo().findOne({
            where: { utente: { id: id_utente } },
            order: { data_avaliacao: 'DESC' },
        });
        const delta = avaliacaoAnterior ? score_total - avaliacaoAnterior.score_total : null;

        // 8. Guardar a avaliação ligada ao questionário ativo descoberto
        const novaAvaliacao = avaliacaoRepo().create({
            utente,
            medico: utente.medico,
            questionario: questionarioActive, // Injetado aqui de forma automática
            score_total,
            nivel_controlo,
        });
        const avaliacaoGuardada = await avaliacaoRepo().save(novaAvaliacao);

        // Alertas automáticos por nível de controlo
        if (nivel_controlo === NivelControlo.NAO_CONTROLADO) {
            await AlertaService.gerarAlertaAutomatico(
                id_utente,
                utente.medico.id,
                TipoAlerta.SCORE_CARAT,
                `Crítico: Utente obteve score de ${score_total} no teste CARAT (Sintomas Não Controlados).`,
                avaliacaoGuardada.id
            );
        } else if (nivel_controlo === NivelControlo.PARCIALMENTE_CONTROLADO) {
            await AlertaService.gerarAlertaAutomatico(
                id_utente,
                utente.medico.id,
                TipoAlerta.SCORE_CARAT,
                `Aviso: Utente obteve score de ${score_total} no teste CARAT (Sintomas Parcialmente Controlados).`,
                avaliacaoGuardada.id
            );
        }

        // Alerta automático por deterioração
        if (delta !== null) {
            const limiarDeterioracao = await getLimiar('limiar_deterioracao', 3);
            if (delta <= -limiarDeterioracao) {
                const pontosPerdidos = Math.abs(delta);
                await AlertaService.gerarAlertaAutomatico(
                    id_utente,
                    utente.medico.id,
                    TipoAlerta.SCORE_CARAT,
                    `Deterioração: Detetada uma queda abrupta de ${pontosPerdidos} pontos no score CARAT em comparação com a avaliação anterior.`,
                    avaliacaoGuardada.id
                );
            }
        }

        // Guardar as respostas individuais
        const respostasEntidades = dto.respostas.map((r) =>
            respostaRepo().create({ avaliacao: avaliacaoGuardada, opcao: opcaoMap.get(r.id_opcao)! })
        );
        await respostaRepo().save(respostasEntidades);

        // RF25, RF26 — Gerar recomendações automáticas
        const recomendacoes = await CaratService.gerarRecomendacoes(avaliacaoGuardada, nivel_controlo, delta);

        return {
            avaliacao: {
                id: avaliacaoGuardada.id,
                data_avaliacao: avaliacaoGuardada.data_avaliacao,
                score_total,
                nivel_controlo,
                delta,
                id_questionario_utilizado: questionarioActive.id // Confirmar qual usou na resposta
            },
            recomendacoes: recomendacoes.map((r) => ({
                id: r.id,
                tipo: r.tipo_recomedacao,
                texto: r.texto_recomendacao,
                data_criacao: r.data_criacao,
            })),
        };
    },

    // RF25, RF26 — Geração automática de recomendações por nível de controlo
    gerarRecomendacoes: async (
        avaliacao: Avaliacao_Carat,
        nivel: NivelControlo,
        delta: number | null,
    ): Promise<Recomendacao[]> => {
        const limiarDeterioriacao = await getLimiar('limiar_deterioracao', 3);
        const novasRecomendacoes: Partial<Recomendacao>[] = [];

        if (nivel === NivelControlo.CONTROLADO) {
            novasRecomendacoes.push({
                avaliacao,
                tipo_recomedacao: TipoRecomendacao.MONITORIZACAO,
                texto_recomendacao: 'A sua doença está controlada. Continue o plano atual e repita a avaliação em 4 semanas.',
            });
        } else if (nivel === NivelControlo.PARCIALMENTE_CONTROLADO) {
            novasRecomendacoes.push({
                avaliacao,
                tipo_recomedacao: TipoRecomendacao.CONSULTA,
                texto_recomendacao: 'O controlo é parcial. Consulte o seu médico para rever o plano terapêutico.',
            });
            novasRecomendacoes.push({
                avaliacao,
                tipo_recomedacao: TipoRecomendacao.ESTILO_VIDA,
                texto_recomendacao: 'Evite os seus gatilhos conhecidos e garanta adesão à medicação prescrita.',
            });
        } else {
            // NAO_CONTROLADO
            novasRecomendacoes.push({
                avaliacao,
                tipo_recomedacao: TipoRecomendacao.INTERVENCAO_URGENTE,
                texto_recomendacao: 'A sua doença não está controlada. Contacte o seu médico com urgência.',
            });
            novasRecomendacoes.push({
                avaliacao,
                tipo_recomedacao: TipoRecomendacao.EXAME,
                texto_recomendacao: 'Pode ser necessária a realização de provas de função respiratória.',
            });
        }

        // Deterioração significativa face à avaliação anterior
        if (delta !== null && delta <= -limiarDeterioriacao) {
            novasRecomendacoes.push({
                avaliacao,
                tipo_recomedacao: TipoRecomendacao.MEDICACAO,
                texto_recomendacao: `Detetou-se uma deterioração de ${Math.abs(delta)} pontos. Pode ser necessário rever a medicação.`,
            });
        }

        const entidades = recomendacaoRepo().create(novasRecomendacoes as Recomendacao[]);
        return recomendacaoRepo().save(entidades);
    },

    // RF22 — Histórico de avaliações do utente
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

    // RF22, RF27 — Detalhe de uma avaliação (score + respostas + recomendações)
    detalheAvaliacao: async (id_avaliacao: number, id_utente?: number) => {
        const avaliacao = await avaliacaoRepo().findOne({
            where: { id: id_avaliacao },
            relations: ['utente', 'questionario'],
        });

        if (!avaliacao) throw new Error('Avaliação não encontrada.');

        // Utente só pode ver as suas próprias avaliações
        if (id_utente !== undefined && avaliacao.utente.id !== id_utente) {
            throw Object.assign(new Error('Acesso não autorizado.'), { code: 'FORBIDDEN' });
        }

        const recomendacoes = await recomendacaoRepo().find({
            where: { avaliacao: { id: id_avaliacao } },
            order: { data_criacao: 'ASC' },
        });

        const respostas = await respostaRepo().find({
            where: { avaliacao: { id: id_avaliacao } },
            relations: ['opcao', 'opcao.questao'],
        });

        return {
            id: avaliacao.id,
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
                data_criacao: rec.data_criacao,
            })),
        };
    },

    // RF23 — Histórico de avaliações de um utente (visão médico)
    listarAvaliacoesMedico: async (id_utente: number, id_medico: number) => {
        const utente = await utenteRepo().findOne({
            where: { id: id_utente, medico: { id: id_medico } },
            relations: ['medico'],
        });
        if (!utente) {
            throw Object.assign(
                new Error('Utente não encontrado ou não está sob a sua responsabilidade.'),
                { code: 'FORBIDDEN' },
            );
        }
        return CaratService.listarAvaliacoesUtente(id_utente);
    },

    //RF 38 - Evolução do score CARAT ao longo do tempo (gráfico)
    obterHistoricoGrafico: async (id_utente: number) => {
        // Obter o limiar atualizado definido pelo admin (ou usar 20 por defeito)
        const limiarParcial = await getLimiar('limiar_parcial', 20);

        const avaliacoes = await avaliacaoRepo().find({
            where: { utente: { id: id_utente } },
            order: { data_avaliacao: 'ASC' }, // Cronológico para o gráfico
            select: {
                id: true,
                data_avaliacao: true,
                score_total: true,
                nivel_controlo: true
            }
        });

        // Mapear os dados num formato ideal para gráficos no Frontend
        const pontosGrafico = avaliacoes.map(av => ({
            id_avaliacao: av.id,
            data: av.data_avaliacao.toISOString().split('T')[0], // Formato YYYY-MM-DD
            score: av.score_total,
            nivel: av.nivel_controlo,
            limiar_critico: limiarParcial // O frontend usa isto para desenhar a linha horizontal fixa
        }));

        return {
            id_utente,
            limiar_alerta: limiarParcial,
            dados: pontosGrafico
        };
    },

    // RF27, RF28 — Listar recomendações de uma avaliação
    listarRecomendacoes: async (id_avaliacao: number) => {
        return await recomendacaoRepo().find({
            where: { avaliacao: { id: id_avaliacao } },
            order: { data_criacao: 'DESC' },
        });
    },

    // RF24 — Criar questionário (Administrador)
    criarQuestionario: async (dto: CriarQuestionarioDto) => {
        const existe = await questionarioRepo().findOne({ where: { versao: dto.versao } });
        if (existe) throw new Error(`Já existe um questionário com a versão "${dto.versao}".`);

        const questionario = questionarioRepo().create({
            versao: dto.versao,
            data_ativacao: dto.data_ativacao,
            data_desativacao: null,
        });
        return await questionarioRepo().save(questionario);
    },

    // RF24 — Desativar questionário (Administrador)
    desativarQuestionario: async (id: number) => {
        const questionario = await questionarioRepo().findOne({ where: { id } });
        if (!questionario) throw new Error('Questionário não encontrado.');
        if (questionario.data_desativacao) throw new Error('O questionário já está desativado.');

        questionario.data_desativacao = new Date().toISOString().split('T')[0]!;
        return await questionarioRepo().save(questionario);
    },

    // RF24 — Criar questão (Administrador)
    criarQuestao: async (dto: CriarQuestaoDto) => {
        const questionario = await questionarioRepo().findOne({ where: { id: dto.id_questionario } });
        if (!questionario) throw new Error('Questionário não encontrado.');

        const questao = questaoRepo().create({ questionario, texto_questao: dto.texto_questao });
        return await questaoRepo().save(questao);
    },

    // RF24 — Criar opção de resposta (Administrador)
    criarOpcaoResposta: async (dto: CriarOpcaoRespostaDto) => {
        const questao = await questaoRepo().findOne({ where: { id: dto.id_questao } });
        if (!questao) throw new Error('Questão não encontrada.');

        const opcao = opcaoRepo().create({
            questao,
            texto_opcao: dto.texto_opcao,
            score: dto.score,
        });
        return await opcaoRepo().save(opcao);
    },
};