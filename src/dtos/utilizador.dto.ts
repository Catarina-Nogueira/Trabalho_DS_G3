import { Tipo_Utilizador, Estado } from "../models/utilizador.entity";

export interface CriarUtilizadorDTO {
    email: string;
    password: string;
    tipo_utilizador: Tipo_Utilizador;
}

export interface AtualizarUtilizadorDTO {
    email?: string;
    password?: string;
    estado?: Estado;
}

export interface UtilizadorRespostaDTO {
    id: number;
    email: string;
    tipo_utilizador: Tipo_Utilizador;
    estado: Estado;
    data_criacao: string;
    data_ultimo_acesso: string;
}