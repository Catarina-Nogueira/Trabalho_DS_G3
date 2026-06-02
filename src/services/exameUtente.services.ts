import { IsNull } from 'typeorm';
import { AppDataSource } from '../database/database';
import { Exame_Utente } from '../models/exameUtente.entity';
import { CriarExameUtenteDTO } from '../dtos/exameUtente.dto';

const exameUtenteRepo = AppDataSource.getRepository(Exame_Utente);

export const ExameUtenteService = {

    // RF48 - Listar todos os exames de um utente
    listarPorUtente: async (id_utente: number) => {
        return await exameUtenteRepo.find({
            where: { utente: { id: id_utente } },
            relations: ['utente', 'medico', 'exame']
        });
    },

    // RF48 - Listar exames pendentes de um utente (sem resultado)
    listarPendentesPorUtente: async (id_utente: number) => {
        return await exameUtenteRepo.find({
            where: {
                utente: { id: id_utente },
                resultado: IsNull()
            },
            relations: ['utente', 'medico', 'exame']
        });
    },

    // Listar todos os exames prescritos por um médico
    listarPorMedico: async (id_medico: number) => {
        return await exameUtenteRepo.find({
            where: { medico: { id: id_medico } },
            relations: ['utente', 'medico', 'exame']
        });
    },

    // RF48 - Consultar detalhe de um exame do utente
    buscarPorId: async (id: number) => {
        return await exameUtenteRepo.findOne({
            where: { id },
            relations: ['utente', 'medico', 'exame']
        });
    },

    // RF46 - Prescrição de exame pelo médico (Ajustado para usar o DTO explicitamente)
    criar: async (dados: CriarExameUtenteDTO) => {
        const exameUtente = exameUtenteRepo.create({
            utente: { id: dados.utente.id },
            medico: { id: dados.medico.id },
            exame: { id: dados.exame.id },
            data_exame: new Date(dados.data_exame)
        });
        return await exameUtenteRepo.save(exameUtente);
    },

    // RF47 - Registo de resultado de exame pelo médico
    registarResultado: async (id: number, resultado: string, interpretacao: string) => {
        await exameUtenteRepo.update(id, {
            resultado,
            interpretacao,
            data_resultado: new Date()
        });
        return await exameUtenteRepo.findOne({
            where: { id },
            relations: ['utente', 'medico', 'exame']
        });
    },

    // Só permite eliminar se o exame ainda estiver pendente (sem resultado)
    eliminar: async (id: number) => {
        const exame = await exameUtenteRepo.findOne({ where: { id } });
        if (!exame) throw new Error('Exame não encontrado');
        if (exame.resultado !== null) {
            throw new Error('Não é possível eliminar um exame que já tem resultado registado');
        }
        return await exameUtenteRepo.delete(id);
    }
};