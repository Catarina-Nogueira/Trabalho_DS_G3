import { AppDataSource } from '../database/database';
import { Medico } from '../models/medico.entity';
import { CriarMedicoDTO, AtualizarMedicoDTO }   from '../dtos/medico.dto';
import { Utilizador } from '../models/utilizador.entity';

const medicoRepo = AppDataSource.getRepository(Medico);
const utilizadorRepo = AppDataSource.getRepository(Utilizador);

export const MedicoService = {

    // Listar todos os médicos
    listarTodos: async () => {
        return await medicoRepo.find({
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
    },

    // Consulta de detalhe de médico
    buscarPorId: async (id: number) => {
        if (!id || id <= 0) throw new Error('ID inválido');

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

        if (!medico) throw new Error('Médico não encontrado');
        return medico;
    },

    // Criar médico
    criar: async (id_utilizador: number, dados: CriarMedicoDTO) => {
        if (!id_utilizador || id_utilizador <= 0) throw new Error('ID de utilizador inválido ou não fornecido.');
        if (!dados.nome) throw new Error('O nome é obrigatório.');
        if (!dados.especialidade) throw new Error('A especialidade é obrigatória.');
        if (!dados.numero_medico) throw new Error('O número de médico é obrigatório.');
        if (!dados.telemovel) throw new Error('O número de telemóvel é obrigatório.');

        const utilizador = await utilizadorRepo.findOneBy({ id: id_utilizador });
        if (!utilizador) throw new Error('Utilizador não encontrado.');

        const jaExiste = await medicoRepo.findOne({ where: { utilizador: { id: id_utilizador } } });
        if (jaExiste) throw new Error('Este utilizador já tem um perfil de médico associado.');

        const numeroExiste = await medicoRepo.findOne({ where: { numero_medico: dados.numero_medico } });
        if (numeroExiste) throw new Error('Já existe um médico registado com este número profissional.');

        const telemovelExiste = await medicoRepo.findOne({ where: { telemovel: dados.telemovel } });
        if (telemovelExiste) throw new Error('Já existe um médico registado com este telemóvel.');

        const novoMedico = medicoRepo.create({
            nome: dados.nome.trim(),
            especialidade: dados.especialidade.trim(),
            numero_medico: dados.numero_medico,
            telemovel: dados.telemovel.trim(),
            utilizador
        });

        const guardado = await medicoRepo.save(novoMedico);

        return await medicoRepo.findOne({
            where: { id: guardado.id },
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
    },

    /// Atualizar nome/telemóvel do médico
    atualizar: async (id: number, dados: AtualizarMedicoDTO) => {
        if (!id || id <= 0) throw new Error('ID inválido');

        const medico = await medicoRepo.findOne({ where: { id }, relations: ['utilizador'] });
        if (!medico) throw new Error('Médico não encontrado');

        if (dados.nome) {
            medico.nome = dados.nome.trim();
        }

        if (dados.telemovel) {
            medico.telemovel = dados.telemovel.trim();
        }

        return await medicoRepo.save(medico);
    },

    eliminar: async (id: number) => {
        if (!id || id <= 0) throw new Error('ID inválido');

        const medico = await medicoRepo.findOneBy({ id });
        if (!medico) throw new Error('Médico não encontrado');

        await medicoRepo.delete(id);
        return { mensagem: 'Médico eliminado com sucesso' };
    }
};