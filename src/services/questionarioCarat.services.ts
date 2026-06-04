import { AppDataSource } from '../database/database';
import { Questionario_Carat } from '../models/questionarioCarat.entity';
import { Questao_Carat } from '../models/questaoCarat.entity';
import { Opcao_Resposta } from '../models/opcaoResposta.entity';
import { IsNull } from 'typeorm';

const questionarioCaratRepo = AppDataSource.getRepository(Questionario_Carat);
const questaoCaratRepo = AppDataSource.getRepository(Questao_Carat);
const opcaoRespostaRepo = AppDataSource.getRepository(Opcao_Resposta);

export const QuestionarioCaratService = {

    // RF16 - Listar todos os questionários
    listarTodos: async () => {
        return await questionarioCaratRepo.find();
    },

    // Consultar detalhe de um questionário
    buscarPorId: async (id: number) => {
        return await questionarioCaratRepo.findOne({
            where: { id }
        });
    },

    // RF16 - Obter o questionário CARAT ativo com todas as questões e opções de resposta
    obterAtivo: async () => {
        const questionario = await questionarioCaratRepo.findOne({
            where: { data_desativacao: IsNull() }
        });

        if (!questionario) return null;

        const questoes = await questaoCaratRepo.find({
            where: { questionario: { id: questionario.id } },
            relations: ['questionario'],
            order: { id: 'ASC' }
        });

        const questoesComOpcoes = await Promise.all(
            questoes.map(async (questao) => {
                const opcoes = await opcaoRespostaRepo.find({
                    where: { questao: { id: questao.id } },
                    order: { id: 'ASC' }
                });
                return {
                    ...questao,
                    opcoes
                };
            })
        );

        return {
            ...questionario,
            questoes: questoesComOpcoes
        };
    },

    // RF24 - Criar questionário CARAT
    criar: async (dados: Partial<Questionario_Carat>) => {
        const questionario = questionarioCaratRepo.create(dados);
        return await questionarioCaratRepo.save(questionario);
    },

    // RF24 - Ativar um questionário (desativa o atual e ativa o novo)
    ativar: async (id: number) => {
        const ativo = await questionarioCaratRepo.findOne({
            where: { data_desativacao: IsNull() }
        });

        if (ativo && ativo.id !== id) {
            ativo.data_desativacao = new Date().toISOString().split('T')[0] as string;
            await questionarioCaratRepo.save(ativo);
        }

        const novoAtivo = await questionarioCaratRepo.findOne({ where: { id } });
        if (!novoAtivo) return null;

        novoAtivo.data_ativacao = new Date().toISOString().split('T')[0] as string;
        novoAtivo.data_desativacao = null as null;
        await questionarioCaratRepo.save(novoAtivo);

        return novoAtivo;
    },

    // RF24 - Desativar um questionário
    desativar: async (id: number) => {
        const questionario = await questionarioCaratRepo.findOne({ where: { id } });
        if (!questionario) return null;

        questionario.data_desativacao = new Date().toISOString().split('T')[0] as string;
        await questionarioCaratRepo.save(questionario);

        return questionario;
    },

    // RF24 - Eliminar questionário
    eliminar: async (id: number) => {
        return await questionarioCaratRepo.delete(id);
    }

};