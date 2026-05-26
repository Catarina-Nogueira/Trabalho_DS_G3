import { Tipo_Utilizador } from "../models/utilizador.entity";

export interface LoginDTO {
    email: string;
    password: string;
}

export interface TokenPayload {
    id_utilizador: number;
    tipo_utilizador: Tipo_Utilizador;
    id_utente?: number;
    id_medico?: number;
}

export interface LoginRespostaDTO {
    token: string;
    tipo_utilizador: Tipo_Utilizador;
    nome: string;
}