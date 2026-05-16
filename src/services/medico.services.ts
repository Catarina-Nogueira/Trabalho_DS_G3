import { AppDataSource } from '../database/database';
import { Medico } from '../models/medico.entity';

const medicoRepo = AppDataSource.getRepository(Medico);

export const MedicoService = {

    // Listar todos os médicos
    listarTodos: async () => {
        return await medicoRepo.find({
            select: {
                id: true,
                nome: true,
                especialidade: true,
                numero_medico: true,
                telemovel: true
            }
        });
    },

    // Consulta de detalhe de médico
    buscarPorId: async (id: number) => {
        return await medicoRepo.findOne({
            where: { id },
            select: {
                id: true,
                nome: true,
                especialidade: true,
                numero_medico: true,
                telemovel: true
            }
        });
    },

    // Criar médico
    criar: async (dados: Partial<Medico>) => {
        const medico = medicoRepo.create(dados);
        return await medicoRepo.save(medico);
    },

    /// Atualizar telemóvel do médico
    atualizarTelemovel: async (id: number, telemovel: string) => {
        await medicoRepo.update(id, { telemovel });
        return await medicoRepo.findOne({
            where: { id },
            select: {
                id: true,
                nome: true,
                especialidade: true,
                numero_medico: true,
                telemovel: true
            }
        });
    },

    eliminar: async (id: number) => {
        return await medicoRepo.delete(id);
    }
};
