import { AppDataSource } from '../database/database';
import { Resposta_Utente } from '../models/respostaUtente.entity';

const respostaUtenteRepo = AppDataSource.getRepository(Resposta_Utente);

export const RespostaUtenteService = {

    // Listar todas as respostas
    listarTodos: async () => {
        return await respostaUtenteRepo.find({
            relations: ['avaliacao', 'opcao', 'opcao.questao']
        });
    },

    // RF17 - Listar respostas de uma avaliação específica
    listarPorAvaliacao: async (id_avaliacao: number) => {
        return await respostaUtenteRepo.find({
            where: { avaliacao: { id: id_avaliacao } },
            relations: ['avaliacao', 'opcao', 'opcao.questao'],
            order: { id: 'ASC' }
        });
    },

    // Consultar detalhe de uma resposta
    buscarPorId: async (id: number) => {
        return await respostaUtenteRepo.findOne({
            where: { id },
            relations: ['avaliacao', 'opcao', 'opcao.questao']
        });
    },

    // RF17 - Submissão de respostas CARAT (cria todas as respostas de uma avaliação de uma vez)
    submeterRespostas: async (id_avaliacao: number, ids_opcoes: number[]) => {
        const respostas = ids_opcoes.map(id_opcao =>
            respostaUtenteRepo.create({
                avaliacao: { id: id_avaliacao },
                opcao: { id: id_opcao }
            })
        );
        return await respostaUtenteRepo.save(respostas);
    },

    // RF17 - Criar uma resposta individual
    criar: async (dados: Partial<Resposta_Utente>) => {
        const resposta = respostaUtenteRepo.create(dados);
        return await respostaUtenteRepo.save(resposta);
    },

    // Eliminar uma resposta
    eliminar: async (id: number) => {
        return await respostaUtenteRepo.delete(id);
    },

    // Eliminar todas as respostas de uma avaliação
    eliminarPorAvaliacao: async (id_avaliacao: number) => {
        return await respostaUtenteRepo.delete({
            avaliacao: { id: id_avaliacao }
        });
    }

};