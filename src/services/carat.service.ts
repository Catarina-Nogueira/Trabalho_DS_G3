/*import { AppDataSource } from '../database/database';
import { Avaliacao_Carat, NivelControlo } from '../models/avaliacaoCarat.entity';
import { Resposta_Utente } from '../models/respostaUtente.entity';
import { Opcao_Resposta } from '../models/opcaoResposta.entity';
import { AlertaService } from './alerta.services';
import { TipoAlerta } from '../models/alerta.entity';
import { AuditoriaService } from './auditoria.services';
import { EntidadeAuditoria, AcaoAuditoria } from '../models/auditoria.entity';

const avaliacaoRepo = AppDataSource.getRepository(Avaliacao_Carat);
const respostaRepo = AppDataSource.getRepository(Resposta_Utente);
const opcaoRepo = AppDataSource.getRepository(Opcao_Resposta);

export const AvaliacaoCaratService = {

    // RF22 - Histórico de avaliações do utente
    listarPorUtente: async (id_utente: number) => {
        return await avaliacaoRepo.find({
            where: { utente: { id: id_utente } },
            relations: ['questionario'],
            order: { data_avaliacao: 'DESC' },
            select: {
                id: true,
                data_avaliacao: true,
                score_total: true,
                nivel_controlo: true,
            }
        });
    },

    // RF23 - Histórico de avaliações para o médico
    listarPorMedico: async (id_utente: number, id_medico: number) => {
        return await avaliacaoRepo.find({
            where: {
                utente: { id: id_utente },
                medico: { id: id_medico }
            },
            order: { data_avaliacao: 'DESC' },
            select: {
                id: true,
                data_avaliacao: true,
                score_total: true,
                nivel_controlo: true,
            }
        });
    },

    // Buscar detalhe de uma avaliação
    buscarPorId: async (id: number) => {
        return await avaliacaoRepo.findOne({
            where: { id },
            relations: ['utente', 'medico', 'questionario']
        });
    },

    // RF19 - Cálculo automático do score CARAT
    calcularScore: (scores: number[]): number => {
        return scores.reduce((total, valor) => total + valor, 0);
    },

    // RF20 - Interpretação do nível de controlo
    determinarNivelControlo: (score: number): NivelControlo => {
        if (score >= 20) return NivelControlo.CONTROLADO;
        if (score >= 10) return NivelControlo.PARCIALMENTE_CONTROLADO;
        return NivelControlo.NAO_CONTROLADO;
    },

    // RF21 - Cálculo da variação de score
    calcularVariacao: async (id_utente: number, score_atual: number): Promise<number | null> => {
        const avaliacaoAnterior = await avaliacaoRepo.findOne({
            where: { utente: { id: id_utente } },
            order: { data_avaliacao: 'DESC' }
        });

        if (!avaliacaoAnterior) return null;
        return score_atual - avaliacaoAnterior.score_total;
    },

    // RF17, RF18, RF19, RF20, RF21 - Submissão de respostas CARAT
    submeter: async (
        id_utente: number,
        id_medico: number,
        id_questionario: number,
        respostas: { id_questao: number, id_opcao: number }[]
    ) => {
        // RF18 - Validação de completude das respostas
        if (!respostas || respostas.length === 0) {
            throw new Error('Respostas em falta');
        }

        // Buscar as opções selecionadas para calcular o score
        const opcoes = await opcaoRepo.findByIds(respostas.map(r => r.id_opcao));

        // RF18 - Verificar se todas as questões foram respondidas
        if (opcoes.length !== respostas.length) {
            throw new Error('Uma ou mais opções de resposta são inválidas');
        }

        // RF19 - Calcular o score total
        const scores = opcoes.map(o => o.score);
        const score_total = AvaliacaoCaratService.calcularScore(scores);

        // RF20 - Determinar nível de controlo
        const nivel_controlo = AvaliacaoCaratService.determinarNivelControlo(score_total);

        // Criar a avaliação
        const avaliacao = avaliacaoRepo.create({
            utente: { id: id_utente },
            medico: { id: id_medico },
            questionario: { id: id_questionario },
            score_total,
            nivel_controlo
        });
        const avaliacaoGuardada = await avaliacaoRepo.save(avaliacao);

        // Guardar as respostas individuais
        for (const r of respostas) {
            const resposta = respostaRepo.create({
                avaliacao: { id: avaliacaoGuardada.id },
                questao: { id: r.id_questao },
                opcao: { id: r.id_opcao }
            });
            await respostaRepo.save(resposta);
        }

        // RF21 - Calcular variação de score
        const variacao = await AvaliacaoCaratService.calcularVariacao(id_utente, score_total);

        // RF29, RF30 - Gerar alerta se necessário
        if (nivel_controlo === NivelControlo.NAO_CONTROLADO) {
            await AlertaService.gerarAlerta(
                id_utente,
                id_medico,
                TipoAlerta.SCORE_CARAT,
                `Score CARAT baixo: ${score_total}`,
                avaliacaoGuardada.id
            );
        } else if (variacao !== null && variacao <= -5) {
            await AlertaService.gerarAlerta(
                id_utente,
                id_medico,
                TipoAlerta.SCORE_CARAT,
                `Deterioração do score CARAT: variação de ${variacao}`,
                avaliacaoGuardada.id
            );
        }

        // RF56 - Registo de auditoria
        await AuditoriaService.registar(
            id_utente,
            EntidadeAuditoria.AVALIACAO_CARAT,
            AcaoAuditoria.CRIAR
        );

        return {
            avaliacao: avaliacaoGuardada,
            score_total,
            nivel_controlo,
            variacao
        };
    }
};*/