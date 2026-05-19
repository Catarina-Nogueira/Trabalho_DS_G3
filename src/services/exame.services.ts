import { AppDataSource } from '../database/database';
import { Exame } from '../models/exame.entity';

const exameRepo = AppDataSource.getRepository(Exame);

export const ExameService = {

    // Listar todos os exames do catálogo
    listarTodos: async () => {
        return await exameRepo.find();
    },

    // Consultar detalhe de um exame por id
    buscarPorId: async (id: number) => {
        return await exameRepo.findOne({
            where: { id }
        });
    },

    // Consultar exame por nome
    buscarPorNome: async (nome_exame: string) => {
        return await exameRepo.findOne({
            where: { nome_exame }
        });
    },

    // Adicionar novo exame ao catálogo
    criar: async (dados: Partial<Exame>) => {
        const exame = exameRepo.create(dados);
        return await exameRepo.save(exame);
    },

    // Atualizar exame do catálogo
    atualizar: async (id: number, dados: Partial<Exame>) => {
        await exameRepo.update(id, dados);
        return await exameRepo.findOne({
            where: { id }
        });
    },

    // Eliminar exame do catálogo
    eliminar: async (id: number) => {
        return await exameRepo.delete(id);
    }
};