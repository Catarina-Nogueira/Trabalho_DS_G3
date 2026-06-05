import { AppDataSource } from '../database/database';
import { Historia_Familiar } from '../models/historiaFamiliar.entity';
import { CriarHistoriaFamiliarDTO, AtualizarHistoriaFamiliarDTO } from '../dtos/historiaFamiliar.dto';
import { AuditoriaService } from './auditoria.services';
import { EntidadeAuditoria, AcaoAuditoria } from '../models/auditoria.entity';

const historiaRepo = AppDataSource.getRepository(Historia_Familiar);

export const HistoriaFamiliarService = {

    listarPorUtente: async (id_utente: number) => {
        return await historiaRepo.find({
            where: { utente: { id: id_utente } },
            relations: ['utente'],
            order: { id: 'DESC' }
        });
    },

    buscarPorId: async (id: number) => {
        return await historiaRepo.findOne({ where: { id }, relations: ['utente'] });
    },

    criar: async (id_utente: number, dados: CriarHistoriaFamiliarDTO, idUtilizadorLogado: number) => {
        const novaHistoria = historiaRepo.create({
            nome: dados.nome.trim(),
            descricao: dados.descricao.trim(),
            utente: { id: id_utente }
        });
        const guardado = await historiaRepo.save(novaHistoria);
        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: EntidadeAuditoria.HISTORIA_FAMILIAR,
            acao: AcaoAuditoria.CRIAR
        });
        return await historiaRepo.findOne({ where: { id: guardado.id }, relations: ['utente'] });
    },

    atualizar: async (id: number, dados: AtualizarHistoriaFamiliarDTO, idUtilizadorLogado: number) => {
        const historia = await historiaRepo.findOne({ where: { id }, relations: ['utente'] });
        if (!historia) return null;
        if (dados.nome !== undefined) historia.nome = dados.nome !== null ? dados.nome.trim() : null;
        if (dados.descricao !== undefined) historia.descricao = dados.descricao !== null ? dados.descricao.trim() : null;
        const atualizado = await historiaRepo.save(historia);
        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: EntidadeAuditoria.HISTORIA_FAMILIAR,
            acao: AcaoAuditoria.ATUALIZAR
        });
        return atualizado;
    },

    eliminar: async (id: number, idUtilizadorLogado: number) => {
        const historia = await historiaRepo.findOne({ where: { id } });
        if (!historia) throw new Error('Registo de história familiar não encontrado.');
        await historiaRepo.remove(historia);
        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: EntidadeAuditoria.HISTORIA_FAMILIAR,
            acao: AcaoAuditoria.ELIMINAR
        });
    }
};
