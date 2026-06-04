import { ILike } from 'typeorm';
import { AppDataSource } from '../database/database';
import { Medicacao } from '../models/medicacao.entity';
import { AuditoriaService } from './auditoria.services';
import { EntidadeAuditoria, AcaoAuditoria } from '../models/auditoria.entity';

const medicacaoRepo = AppDataSource.getRepository(Medicacao);

export const MedicacaoService = {

    listarTodos: async () => {
        return await medicacaoRepo.find({
            order: { nome_medicamento: 'ASC' }
        });
    },

    buscarPorId: async (id: number) => {
        if (!id || id <= 0) throw new Error('ID inválido ou não fornecido.');
        return await medicacaoRepo.findOne({ where: { id } });
    },

    
    buscarPorNome: async (nome_medicamento: string) => {
        if (!nome_medicamento) throw new Error('O nome de pesquisa não pode estar vazio.');
        return await medicacaoRepo.find({
            where: { nome_medicamento: ILike(`%${nome_medicamento.trim()}%`) }
        });
    },

   
    criar: async (dados: Partial<Medicacao>, idUtilizadorLogado: number) => {
        if (!dados.nome_medicamento?.trim()) throw new Error('O nome do medicamento é obrigatório.');
        if (!dados.substancia_ativa?.trim()) throw new Error('A substância ativa é obrigatória.');

        const medicacao = medicacaoRepo.create({
            nome_medicamento: dados.nome_medicamento.trim(),
            substancia_ativa: dados.substancia_ativa.trim(),
            tipo: dados.tipo?.trim() || 'Não especificado',
            descricao: dados.descricao?.trim() || '',
            objetivo: dados.objetivo?.trim() || ''
        });

        const guardado = await medicacaoRepo.save(medicacao);

        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: 'MEDICACAO' as EntidadeAuditoria,
            acao: 'CRIAR' as AcaoAuditoria
        });

        return guardado;
    },

    
    atualizar: async (id: number, dados: Partial<Medicacao>, idUtilizadorLogado: number) => {
        if (!id || id <= 0) throw new Error('ID inválido.');

        const medicacao = await medicacaoRepo.findOne({ where: { id } });
        if (!medicacao) return null;

        if (dados.nome_medicamento) medicacao.nome_medicamento = dados.nome_medicamento.trim();
        if (dados.substancia_ativa) medicacao.substancia_ativa = dados.substancia_ativa.trim();
        if (dados.tipo) medicacao.tipo = dados.tipo.trim();
        if (dados.descricao) medicacao.descricao = dados.descricao.trim();
        if (dados.objetivo) medicacao.objetivo = dados.objetivo.trim();

        const atualizado = await medicacaoRepo.save(medicacao);

        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: 'MEDICACAO' as EntidadeAuditoria,
            acao: 'ATUALIZAR' as AcaoAuditoria
        });

        return atualizado;
    },

    
    eliminar: async (id: number, idUtilizadorLogado: number): Promise<boolean> => {
        if (!id || id <= 0) throw new Error('ID inválido.');

        const medicacao = await medicacaoRepo.findOne({ where: { id } });
        if (!medicacao) return false;

        await medicacaoRepo.remove(medicacao);

        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: 'MEDICACAO' as EntidadeAuditoria,
            acao: 'ELIMINAR' as AcaoAuditoria
        });

        return true;
    }
};