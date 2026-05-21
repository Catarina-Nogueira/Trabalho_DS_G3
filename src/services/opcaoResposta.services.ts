import { AppDataSource } from '../database/database';
import { Opcao_Resposta } from '../models/opcaoResposta.entity';

const opcaoRespostaRepo = AppDataSource.getRepository(Opcao_Resposta);

export const OpcaoRespostaService = {

    // RF16 - Obter todas as opções de resposta (para montar o questionário)
    listarTodos: async () => {
        return await opcaoRespostaRepo.find({
            relations: ['questao']
        });
    },

    // RF16 - Listar opções de resposta de uma questão específica
    listarPorQuestao: async (id_questao: number) => {
        return await opcaoRespostaRepo.find({
            where: { questao: { id: id_questao } },
            relations: ['questao']
        });
    },

    // Consultar detalhe de uma opção de resposta
    buscarPorId: async (id: number) => {
        return await opcaoRespostaRepo.findOne({
            where: { id },
            relations: ['questao']
        });
    },

    // RF24 - Gestão de opções do CARAT (criar opção)
    criar: async (dados: Partial<Opcao_Resposta>) => {
        const opcao = opcaoRespostaRepo.create(dados);
        return await opcaoRespostaRepo.save(opcao);
    },

    // RF24 - Gestão de opções do CARAT (editar opção)
    atualizar: async (id: number, dados: Partial<Opcao_Resposta>) => {
        await opcaoRespostaRepo.update(id, dados);
        return await opcaoRespostaRepo.findOne({
            where: { id },
            relations: ['questao']
        });
    },

    // RF24 - Gestão de opções do CARAT (eliminar opção)
    eliminar: async (id: number) => {
        return await opcaoRespostaRepo.delete(id);
    }

};