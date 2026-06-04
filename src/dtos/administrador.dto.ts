export interface CriarAdministradorDTO {
    nome: string;
}

export interface AtualizarAdministradorDTO {
    nome?: string | undefined;
}

export interface AdministradorRespostaDTO {
    id: number;
    nome: string;
    utilizador: { id: number; email: string, username: string; data_criacao: string};
}