import { AppDataSource } from '../database/database';
import { Recomendacao, TipoRecomendacao } from '../models/recomendacao.entity';

const recomendacaoRepo = AppDataSource.getRepository(Recomendacao);

export const RecomendacaoService = {

    // RF27 - Listar todas as recomendações
    listarTodos: async () => {
        return await recomendacaoRepo.find({
            relations: ['avaliacao']
        });
    },

    // RF27 - Listar recomendações de uma avaliação específica (ordenadas da mais recente para a mais antiga)
    listarPorAvaliacao: async (id_avaliacao: number) => {
        return await recomendacaoRepo.find({
            where: { avaliacao: { id: id_avaliacao } },
            relations: ['avaliacao'],
            order: { data_criacao: 'DESC' }
        });
    },

    // RF27 - Listar recomendações de um utente (através das suas avaliações, da mais recente para a mais antiga)
    listarPorUtente: async (id_utente: number) => {
        return await recomendacaoRepo.find({
            where: { avaliacao: { utente: { id: id_utente } } },
            relations: ['avaliacao', 'avaliacao.utente'],
            order: { data_criacao: 'DESC' }
        });
    },

    // RF28 - Listar recomendações de um utente específico para o médico
    listarPorUtenteParaMedico: async (id_utente: number, id_medico: number) => {
        return await recomendacaoRepo.find({
            where: { avaliacao: { utente: { id: id_utente, medico: { id: id_medico } } } },
            relations: ['avaliacao', 'avaliacao.utente'],
            order: { data_criacao: 'DESC' }
        });
    },

    // Consultar detalhe de uma recomendação
    buscarPorId: async (id: number) => {
        return await recomendacaoRepo.findOne({
            where: { id },
            relations: ['avaliacao']
        });
    },

    // RF25 - Geração automática de recomendação com base no nível de controlo
    gerarAutomatica: async (id_avaliacao: number, nivel_controlo: string, score_total: number) => {
        const recomendacoes = [];

        if (nivel_controlo === 'NAO_CONTROLADO') {
            recomendacoes.push({
                avaliacao: { id: id_avaliacao },
                texto_recomendacao: 'O seu estado de saúde indica falta de controlo da doença. Recomenda-se consulta médica urgente.',
                tipo_recomedacao: TipoRecomendacao.INTERVENCAO_URGENTE
            });
            recomendacoes.push({
                avaliacao: { id: id_avaliacao },
                texto_recomendacao: 'Recomenda-se revisão da medicação atual com o seu médico.',
                tipo_recomedacao: TipoRecomendacao.MEDICACAO
            });
        } else if (nivel_controlo === 'PARCIAL') {
            recomendacoes.push({
                avaliacao: { id: id_avaliacao },
                texto_recomendacao: 'O seu estado de saúde indica controlo parcial da doença. Recomenda-se consulta médica.',
                tipo_recomedacao: TipoRecomendacao.CONSULTA
            });
            recomendacoes.push({
                avaliacao: { id: id_avaliacao },
                texto_recomendacao: 'Recomenda-se monitorização mais frequente dos sintomas.',
                tipo_recomedacao: TipoRecomendacao.MONITORIZACAO
            });
        } else if (nivel_controlo === 'CONTROLADO') {
            recomendacoes.push({
                avaliacao: { id: id_avaliacao },
                texto_recomendacao: 'O seu estado de saúde indica bom controlo da doença. Continue com os hábitos atuais.',
                tipo_recomedacao: TipoRecomendacao.ESTILO_VIDA
            });
        }

        const resultado = recomendacoes.map(r => recomendacaoRepo.create(r));
        return await recomendacaoRepo.save(resultado);
    },

    // RF26 - Criar recomendação manualmente
    criar: async (dados: Partial<Recomendacao>) => {
        const recomendacao = recomendacaoRepo.create(dados);
        return await recomendacaoRepo.save(recomendacao);
    },

    // Atualizar recomendação
    atualizar: async (id: number, dados: Partial<Recomendacao>) => {
        await recomendacaoRepo.update(id, dados);
        return await recomendacaoRepo.findOne({
            where: { id },
            relations: ['avaliacao']
        });
    },

    // Eliminar recomendação
    eliminar: async (id: number) => {
        return await recomendacaoRepo.delete(id);
    }

};