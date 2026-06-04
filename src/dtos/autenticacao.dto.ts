import { Tipo_Utilizador } from "../models/utilizador.entity";

export interface LoginDTO {
    username: string;
    password: string;
}

export interface TokenPayload {
    id_utilizador: number;
    tipo_utilizador: Tipo_Utilizador;
    id_perfil_especifico?: number | undefined; // id_utente ou id_medico
}

export interface LoginRespostaDTO {
    token: string;
    tipo_utilizador: Tipo_Utilizador;
    nome: string;
    id_perfil_especifico?: number | undefined;
}