export interface CriarAdministradorDTO {
    nome: string;
    utilizador: { id: number };
}

export interface AdministradorRespostaDTO {
    id: number;
    nome: string;
    utilizador: { id: number; email: string };
}