import { Sexo_Biologico } from "../models/utente.entity";
import { Estado, Tipo_Utilizador } from "../models/utilizador.entity";

export interface CriarUtenteDTO {
    nome: string;
    data_nascimento: string;
    sexo_biologico: Sexo_Biologico;
}

export interface AtualizarUtenteDTO {
    nome?: string | undefined;
    medico?: { id: number } | undefined;  
}

export interface UtenteRespostaDTO {
    id: number;
    nome: string;
    data_nascimento: string;
    idade: number;
    sexo_biologico: Sexo_Biologico;
    utilizador: { id: number; username: string; email: string, estado: Estado, tipo_utilizador: Tipo_Utilizador};
    medico: { id: number; nome: string; especialidade: string };
    data_atualizacao: Date;
}