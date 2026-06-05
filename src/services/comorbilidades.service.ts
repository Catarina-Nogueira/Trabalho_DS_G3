import { AppDataSource } from '../database/database';
import { Comorbilidade } from '../models/comorbilidade.entity';
import { CriarComorbilidadeDTO, AtualizarComorbilidadeDTO } from '../dtos/comorbilidade.dto';
import { AuditoriaService } from './auditoria.services';
import { EntidadeAuditoria, AcaoAuditoria } from '../models/auditoria.entity';

const comorbilidadeRepo = AppDataSource.getRepository(Comorbilidade);

export const ComorbilidadeService = {

    buscarPorId: async (id: number) => {
        return await comorbilidadeRepo.findOne({ where: { id }, relations: ['utente'] });
    },

    listarPorUtente: async (id_utente: number) => {
        return await comorbilidadeRepo.find({
            where: { utente: { id: id_utente } },
            relations: ['utente'],
            order: { nome: 'ASC' }
        });
    },

    criar: async (id_utente: number, dados: CriarComorbilidadeDTO, idUtilizadorLogado: number) => {
        const comorbilidade = comorbilidadeRepo.create({
            nome: dados.nome.trim(),
            descricao: dados.descricao.trim(),
            utente: { id: id_utente }
        });
        const guardado = await comorbilidadeRepo.save(comorbilidade);
        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: EntidadeAuditoria.COMORBILIDADE,
            acao: AcaoAuditoria.CRIAR
        });
        return await comorbilidadeRepo.findOne({ where: { id: guardado.id }, relations: ['utente'] });
    },

    atualizar: async (id: number, dados: AtualizarComorbilidadeDTO, idUtilizadorLogado: number) => {
        const comorbilidade = await comorbilidadeRepo.findOne({ where: { id }, relations: ['utente'] });
        if (!comorbilidade) return null;
        if (dados.nome !== undefined) comorbilidade.nome = dados.nome.trim();
        if (dados.descricao !== undefined) comorbilidade.descricao = dados.descricao.trim();
        const atualizado = await comorbilidadeRepo.save(comorbilidade);
        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: EntidadeAuditoria.COMORBILIDADE,
            acao: AcaoAuditoria.ATUALIZAR
        });
        return atualizado;
    },

    eliminar: async (id: number, idUtilizadorLogado: number) => {
        const comorbilidade = await comorbilidadeRepo.findOne({ where: { id } });
        if (!comorbilidade) throw new Error('Comorbilidade não encontrada.');
        await comorbilidadeRepo.remove(comorbilidade);
        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: EntidadeAuditoria.COMORBILIDADE,
            acao: AcaoAuditoria.ELIMINAR
        });
    }
};
