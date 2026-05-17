import { AppDataSource } from '../database/database';
import { Comorbilidade } from '../models/comorbilidade.entity';

const comorbilidadeRepo = AppDataSource.getRepository(Comorbilidade);

export const ComorbilidadeService = {

    // RF53 - Listar todas as comorbilidades de um utente
    listarPorUtente: async (id_utente: number) => {
        return await comorbilidadeRepo.find({
            where: { utente: { id: id_utente } },
            relations: ['utente']
        });
    },

     // RF53 - Consultar detalhe de uma comorbilidade específica
    buscarPorId: async (id: number) => {
        return await comorbilidadeRepo.findOne({
            where: { id },
            relations: ['utente']
        });
    },

     // RF53 - Adicionar comorbilidade a um utente
    criar: async (dados: Partial<Comorbilidade>) => {
        const comorbilidade = comorbilidadeRepo.create(dados);
        return await comorbilidadeRepo.save(comorbilidade);
    },

    // RF53 - Editar comorbilidade existente
    atualizar: async (id: number, dados: Partial<Comorbilidade>) => {
        await comorbilidadeRepo.update(id, dados);
        return await comorbilidadeRepo.findOne({
            where: { id },
            relations: ['utente']
        });
    },

    // RF53 - Remover comorbilidade de um utente
    eliminar: async (id: number) => {
        return await comorbilidadeRepo.delete(id);
    }
};