export interface CriarAdministradorDTO {
    nome: string;
    utilizador: { id: number };
}

// O administrador só pode atualizar o nome
export interface AtualizarAdministradorDTO {
    nome: string;
}

export interface AdministradorRespostaDTO {
    id: number;
    nome: string;
    utilizador: { id: number; email: string };
}