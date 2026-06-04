import { Tipo_Utilizador } from "../models/utilizador.entity";

export interface CriarMedicoDTO {
    nome: string;
    especialidade: string;
    numero_medico: number;
    telemovel: string;
}

export interface AtualizarMedicoDTO {
    nome?: string | undefined;
    telemovel?: string | undefined;
}

export interface MedicoRespostaDTO {
    id: number;
    nome: string;
    especialidade: string;
    numero_medico: number;
    telemovel: string;
    utilizador: { id: number; email: string; tipo_utilizador: Tipo_Utilizador };
}