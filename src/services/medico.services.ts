import { AppDataSource } from '../database/database';
import { Medico } from '../models/medico.entity';
import { CriarMedicoDTO, AtualizarMedicoDTO }   from '../dtos/medico.dto';

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
        if (!id || id <= 0) {
            throw new Error ('ID inválido');
        }

        const medico = await medicoRepo.findOne({
            where: { id },
            relations: ['utilizador'],
            select: {
                id: true,
                nome: true,
                especialidade: true,
                numero_medico: true,
                telemovel: true,
                utilizador: {
                    id: true,
                    email: true,
                    tipo_utilizador: true
                }
            }
        });

        if (!medico) {
            throw new Error('Médico não encontrado');
        }
        return medico;
    },

    // Criar médico
    criar: async (dados: CriarMedicoDTO) => {
        if (!dados.nome) {
            throw new Error('É necessário colocar o nome.');
    
        }
        if (!dados.especialidade) {
             throw new Error('É necessário colocar a especialidade.');
        }
        if (!dados.numero_medico) {
             throw new Error('É necessário colocar o número de médico.');
        }
        if (!dados.telemovel) {
             throw new Error('É necessário colocar no número de telemóvel.');
        }

        const medico = medicoRepo.create(dados);
        return await medicoRepo.save(medico);
    },

    /// Atualizar nome/telemóvel do médico
    atualizar: async (id: number, dados: AtualizarMedicoDTO) => {
        if (!id || id <= 0) {
             throw new Error('ID inválido');
        }

        const medico = await medicoRepo.findOneBy({ id });
        if (!medico) {
             throw new Error('Médico não encontrado')
        }

        if (dados.nome) {
            medico.nome = dados.nome.trim();
        }

        if (dados.telemovel) {
            medico.telemovel = dados.telemovel;
        }

        return await medicoRepo.save(medico);
    },

// Eliminar médico
    eliminar: async (id: number) => {
        if (!id || id <= 0) {
             throw new Error('ID inválido');
        }

        const medico = await medicoRepo.findOneBy({ id });
        if (!medico) {
             throw new Error('Médico não encontrado');
        }

        await medicoRepo.delete(id);
        return { mensagem: 'Médico eliminado com sucesso' };
    }
};
