export interface CriarPlanoDTO {
    descricao: string;
    data_inicio: string;
    data_fim: string | null;
}

export interface AtualizarPlanoDTO {
    descricao?: string;
    data_inicio?: string;
    data_fim?: string | null;
}