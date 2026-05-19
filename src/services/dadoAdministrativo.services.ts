import { AppDataSource } from '../database/database';
import { Dado_Administrativo } from '../models/dadoAdministrativo.entity';

const dadoAdministrativoRepo = AppDataSource.getRepository(Dado_Administrativo);

export const DadoAdministrativoService = {

    // RF06 - Consultar dados administrativos de um utente
    buscarPorUtente: async (id_utente: number) => {
        return await dadoAdministrativoRepo.findOne({
            where: { utente: { id: id_utente } },
            relations: ['utente']
        });
    },

    // RF06 - Consultar detalhe de um registo administrativo por id
    buscarPorId: async (id: number) => {
        return await dadoAdministrativoRepo.findOne({
            where: { id },
            relations: ['utente']
        });
    },

    // RF06 - Criar dados administrativos de um utente
    criar: async (dados: Partial<Dado_Administrativo>) => {
        const dadoAdministrativo = dadoAdministrativoRepo.create(dados);
        return await dadoAdministrativoRepo.save(dadoAdministrativo);
    },

    // RF05 - Atualizar dados administrativos de um utente
    atualizar: async (id: number, dados: Partial<Dado_Administrativo>) => {
        await dadoAdministrativoRepo.update(id, dados);
        return await dadoAdministrativoRepo.findOne({
            where: { id },
            relations: ['utente']
        });
    },

    // Eliminar dados administrativos de um utente
    eliminar: async (id: number) => {
        return await dadoAdministrativoRepo.delete(id);
    }
};