import { IsNull } from 'typeorm';
import { AppDataSource } from '../database/database';
import { Exame_Utente } from '../models/exameUtente.entity';
import { CriarExameUtenteDTO, RegistarResultadoExameDTO } from '../dtos/exameUtente.dto';
import { AuditoriaService } from './auditoria.services';
import { EntidadeAuditoria, AcaoAuditoria } from '../models/auditoria.entity';

const exameUtenteRepo = AppDataSource.getRepository(Exame_Utente);

export const ExameUtenteService = {

    listarPorUtente: async (id_utente: number) => {
        return await exameUtenteRepo.find({
            where: { utente: { id: id_utente } },
            relations: ['utente', 'medico', 'exame'],
            order: { data_exame: 'DESC' }
        });
    },

    listarPendentesPorUtente: async (id_utente: number) => {
        return await exameUtenteRepo.find({
            where: { utente: { id: id_utente }, resultado: IsNull() },
            relations: ['utente', 'medico', 'exame'],
            order: { data_exame: 'ASC' }
        });
    },

    listarPorMedico: async (id_medico: number) => {
        return await exameUtenteRepo.find({
            where: { medico: { id: id_medico } },
            relations: ['utente', 'medico', 'exame'],
            order: { data_exame: 'DESC' }
        });
    },

    buscarPorId: async (id: number) => {
        return await exameUtenteRepo.findOne({ where: { id }, relations: ['utente', 'medico', 'exame'] });
    },

    criar: async (dados: CriarExameUtenteDTO, idUtilizadorLogado: number) => {
        const exameUtente = exameUtenteRepo.create({
            utente: { id: dados.utente.id },
            medico: { id: dados.medico.id },
            exame: { id: dados.exame.id },
            data_exame: new Date(dados.data_exame)
        });
        const guardado = await exameUtenteRepo.save(exameUtente);
        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: EntidadeAuditoria.EXAME_UTENTE,
            acao: AcaoAuditoria.CRIAR
        });
        return guardado;
    },

    registarResultado: async (id: number, dados: RegistarResultadoExameDTO, idUtilizadorLogado: number) => {
        await exameUtenteRepo.update(id, {
            resultado: dados.resultado,
            interpretacao: dados.interpretacao,
            data_resultado: new Date()
        });
        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: EntidadeAuditoria.EXAME_UTENTE,
            acao: AcaoAuditoria.ATUALIZAR
        });
        return await exameUtenteRepo.findOne({ where: { id }, relations: ['utente', 'medico', 'exame'] });
    },

    eliminar: async (id: number, idUtilizadorLogado: number) => {
        const exame = await exameUtenteRepo.findOne({ where: { id } });
        if (!exame) throw new Error('Exame não encontrado para eliminação.');
        if (exame.resultado !== null) throw new Error('Não é possível eliminar um exame que já tem resultado registado.');
        await exameUtenteRepo.delete(id);
        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: EntidadeAuditoria.EXAME_UTENTE,
            acao: AcaoAuditoria.ELIMINAR
        });
    }
};
