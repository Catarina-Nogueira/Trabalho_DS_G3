import { EntidadeAuditoria, AcaoAuditoria } from '../models/auditoria.entity';

export interface CriarAuditoriaDTO {
    id_utilizador: number;
    entidade_afetada: EntidadeAuditoria;
    acao: AcaoAuditoria;
}

export interface AuditoriaRespostaDTO {
    id: number;
    data: string;
    entidade_afetada: string;
    acao: string;
    utilizador: {
        id: number;
        email: string;
        tipo: string;
    };
}