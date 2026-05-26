export interface CriarMedicoDTO {
    nome: string;
    especialidade: string;
    numero_medico: number;
    telemovel: string;
}

export interface AtualizarMedicoDTO {
    nome?: string;
    telemovel?: string;
}

export interface MedicoRespostaDTO {
    id: number;
    nome: string;
    especialidade: string;
    numero_medico: number;
    telemovel: string;
    utilizador: { id: number; email: string; tipo_utilizador: string };
}