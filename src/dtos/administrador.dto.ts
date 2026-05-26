export interface CriarAdministradorDTO {
    nome: string;
    utilizador: { id: number };
}

export interface AtualizarAdministradorDTO {
    nome?: string;
}

export interface AdministradorRespostaDTO {
    id: number;
    nome: string;
    utilizador: { id: number; email: string };
}