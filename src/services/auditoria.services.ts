import { AppDataSource } from '../database/database';
import { Auditoria, EntidadeAuditoria, AcaoAuditoria } from '../models/auditoria.entity';

const auditoriaRepo = AppDataSource.getRepository(Auditoria);

export const AuditoriaService = {

    // RF56 - Registo automático de auditoria
    registar: async (
        id_utilizador: number,
        entidade_afetada: EntidadeAuditoria,
        acao: AcaoAuditoria,
    ) => {
        const auditoria = auditoriaRepo.create({
            utilizador: { id: id_utilizador },
            entidade_afetada,
            acao,
        });
        return await auditoriaRepo.save(auditoria);
    },

    // RF57 - Listagem e filtragem de logs de auditoria
    listarComFiltros: async (
        id_utilizador?: number,
        entidade_afetada?: string,
        acao?: string,
        data_inicio?: string,
        data_fim?: string,
        pagina: number = 1,
        limite: number = 10
    ) => {
        const query = auditoriaRepo.createQueryBuilder('auditoria')
            .leftJoinAndSelect('auditoria.utilizador', 'utilizador')
            .orderBy('auditoria.data', 'DESC');

        if (id_utilizador) {
            query.andWhere('auditoria.utilizador = :id_utilizador', { id_utilizador });
        }
        if (entidade_afetada) {
            query.andWhere('auditoria.entidade_afetada = :entidade_afetada', { entidade_afetada });
        }
        if (acao) {
            query.andWhere('auditoria.acao = :acao', { acao });
        }
        if (data_inicio) {
            query.andWhere('auditoria.data >= :data_inicio', { data_inicio });
        }
        if (data_fim) {
            query.andWhere('auditoria.data <= :data_fim', { data_fim });
        }

        // Paginação
        const total = await query.getCount();
        const registos = await query
            .skip((pagina - 1) * limite)
            .take(limite)
            .getMany();

        return {
            total,
            pagina,
            limite,
            registos
        };
    },

    // RF58 - Exportação de logs de auditoria
    exportar: async (
        id_utilizador?: number,
        entidade_afetada?: string,
        acao?: string,
        data_inicio?: string,
        data_fim?: string
    ) => {
        const query = auditoriaRepo.createQueryBuilder('auditoria')
            .leftJoinAndSelect('auditoria.utilizador', 'utilizador')
            .orderBy('auditoria.data', 'DESC');

        if (id_utilizador) {
            query.andWhere('auditoria.utilizador = :id_utilizador', { id_utilizador });
        }
        if (entidade_afetada) {
            query.andWhere('auditoria.entidade_afetada = :entidade_afetada', { entidade_afetada });
        }
        if (acao) {
            query.andWhere('auditoria.acao = :acao', { acao });
        }
        if (data_inicio) {
            query.andWhere('auditoria.data >= :data_inicio', { data_inicio });
        }
        if (data_fim) {
            query.andWhere('auditoria.data <= :data_fim', { data_fim });
        }

        return await query.getMany();
    }
};