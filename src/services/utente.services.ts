import { AppDataSource } from '../database/database';
import { Utente } from '../models/utente.entity';

const utenteRepo = AppDataSource.getRepository(Utente);

export const UtenteService = {

    // RF51 - Listagem de utentes (para o médico ver os seus utentes)
    listarTodos: async () => {
        return await utenteRepo.find({
            relations: ['medico']
        });
    },

    // RF51 - Listar utentes de um médico específico
    listarPorMedico: async (id_medico: number) => {
        return await utenteRepo.find({
            where: { medico: { id: id_medico } },
            relations: ['medico']
        });
    },

    // RF50 - Consulta de detalhe de utente
    buscarPorId: async (id: number) => {
        return await utenteRepo.findOne({
            where: { id },
            relations: ['medico'],
        });
    },

    // RF50 - Consulta de detalhe de utente
    buscarDadosPermitidos: async (id: number) => {
        return await utenteRepo.findOne({
            where: { id },
            select: {
                id: true,
                nome: true,
                data_nascimento: true,
                sexo_biologico: true
            }
        });
    },

    // RF05 - Gestão de dados pessoais
    criar: async (dados: Partial<Utente>) => {
        const utente = utenteRepo.create(dados);
        return await utenteRepo.save(utente);
    },

    // RF05 - Atualizar dados pessoais permitidos
    atualizar: async (id: number, dados: Partial<Utente>) => {
        await utenteRepo.update(id, dados);
        return await utenteRepo.findOne({
            where: { id },
            relations: ['medico']
        });
    },

    //eliminação do utente
    eliminar: async (id: number) => {
        return await utenteRepo.delete(id);
    }
};

