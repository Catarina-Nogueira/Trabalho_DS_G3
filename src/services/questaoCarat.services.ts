import { AppDataSource } from '../database/database';
import { Questao_Carat } from '../models/questaoCarat.entity';

const questaoCaratRepo = AppDataSource.getRepository(Questao_Carat);

export const QuestaoCaratService = {

    // RF16 - Listar todas as questões (para montar o questionário)
    listarTodos: async () => {
        return await questaoCaratRepo.find({
            relations: ['questionario']
        });
    },

    // RF16 - Listar questões de um questionário específico
    listarPorQuestionario: async (id_questionario: number) => {
        return await questaoCaratRepo.find({
            where: { questionario: { id: id_questionario } },
            relations: ['questionario']
        });
    },

    // Consultar detalhe de uma questão
    buscarPorId: async (id: number) => {
        return await questaoCaratRepo.findOne({
            where: { id },
            relations: ['questionario']
        });
    },

    // RF24 - Gestão de questões do CARAT (criar questão)
    criar: async (dados: Partial<Questao_Carat>) => {
        const questao = questaoCaratRepo.create(dados);
        return await questaoCaratRepo.save(questao);
    },

    // RF24 - Gestão de questões do CARAT (editar questão)
    atualizar: async (id: number, dados: Partial<Questao_Carat>) => {
        await questaoCaratRepo.update(id, dados);
        return await questaoCaratRepo.findOne({
            where: { id },
            relations: ['questionario']
        });
    },

    // RF24 - Gestão de questões do CARAT (eliminar questão)
    eliminar: async (id: number) => {
        return await questaoCaratRepo.delete(id);
    }

};