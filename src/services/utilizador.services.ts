import { AppDataSource } from '../database/database';
import { Utilizador } from '../models/utilizador.entity';

const utilizadorRepo = AppDataSource.getRepository(Utilizador);

export const UtilizadorService = {

    listarTodos: async () => {
        return await utilizadorRepo.find();
    },

    buscarPorId: async (id: number) => {
        return await utilizadorRepo.findOneBy({ id });
    },

    criar: async (dados: Partial<Utilizador>) => {
        const utilizador = utilizadorRepo.create(dados);
        return await utilizadorRepo.save(utilizador);
    },

    atualizar: async (id: number, dados: Partial<Utilizador>) => {
        await utilizadorRepo.update(id, dados);
        return await utilizadorRepo.findOneBy({ id });
    },

    eliminar: async (id: number) => {
        return await utilizadorRepo.delete(id);
    }
};