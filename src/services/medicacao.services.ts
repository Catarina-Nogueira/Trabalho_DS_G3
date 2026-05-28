import { AppDataSource } from '../database/database';
import { Medicacao } from '../models/medicacao.entity';

const medicacaoRepo = AppDataSource.getRepository(Medicacao);

export const MedicacaoService = {

    // Listar todos os medicamentos do catálogo
    listarTodos: async () => {
        return await medicacaoRepo.find();
    },

    // Consultar detalhe de um medicamento por id
    buscarPorId: async (id: number) => {
        return await medicacaoRepo.findOne({
            where: { id }
        });
    },

    // Consultar medicamento por nome
    buscarPorNome: async (nome_medicamento: string) => {
        return await medicacaoRepo.findOne({
            where: { nome_medicamento }
        });
    },

    // Adicionar novo medicamento ao catálogo
    criar: async (dados: Partial<Medicacao>) => {
        const medicacao = medicacaoRepo.create(dados);
        return await medicacaoRepo.save(medicacao);
    },

    // Atualizar medicamento do catálogo
    atualizar: async (id: number, dados: Partial<Medicacao>) => {
        await medicacaoRepo.update(id, dados);
        return await medicacaoRepo.findOne({
            where: { id }
        });
    },

    // Eliminar medicamento do catálogo
    eliminar: async (id: number) => {
        return await medicacaoRepo.delete(id);
    }
};