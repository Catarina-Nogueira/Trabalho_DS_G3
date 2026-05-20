import { AppDataSource } from '../database/database';
import { Historia_Familiar } from '../models/historiaFamiliar.entity';

const historiaFamiliarRepo = AppDataSource.getRepository(Historia_Familiar);

export const HistoriaFamiliarService = {

    // RF52 - Listar toda a história familiar de um utente
    listarPorUtente: async (id_utente: number) => {
        return await historiaFamiliarRepo.find({
            where: { utente: { id: id_utente } },
            relations: ['utente']
        });
    },

    // RF52 - Consultar detalhe de um registo de história familiar
    buscarPorId: async (id: number) => {
        return await historiaFamiliarRepo.findOne({
            where: { id },
            relations: ['utente']
        });
    },

    // RF52 - Adicionar registo de história familiar
    criar: async (dados: Partial<Historia_Familiar>) => {
        const historiaFamiliar = historiaFamiliarRepo.create(dados);
        return await historiaFamiliarRepo.save(historiaFamiliar);
    },

    // RF52 - Editar registo de história familiar
    atualizar: async (id: number, dados: Partial<Historia_Familiar>) => {
        await historiaFamiliarRepo.update(id, dados);
        return await historiaFamiliarRepo.findOne({
            where: { id },
            relations: ['utente']
        });
    },

    // RF52 - Remover registo de história familiar
    eliminar: async (id: number) => {
        return await historiaFamiliarRepo.delete(id);
    }
};