export interface CriarUtilizadorDTO {
    email: string;
    password: string;
    tipo_utilizador: 'utente' | 'medico' | 'administrador';
    estado: 'ativo' | 'inativo';
}

export interface AtualizarUtilizadorDTO {
    email?: string;
    password?: string;
    estado?: 'ativo' | 'inativo';
}

export interface UtilizadorRespostaDTO {
    id: number;
    email: string;
    tipo_utilizador: string;
    estado: string;
    data_criacao: Date;
    data_ultimo_acesso: Date;
}