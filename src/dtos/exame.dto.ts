import { TipoExame } from "../models/exame.entity";

export interface CriarExameDTO {
    nome_exame: string;
    descricao: string;
    tipo: TipoExame;
}

export interface AtualizarExameDTO {
    nome_exame?: string | undefined;
    descricao?: string | undefined;
    tipo?: TipoExame | undefined;
}