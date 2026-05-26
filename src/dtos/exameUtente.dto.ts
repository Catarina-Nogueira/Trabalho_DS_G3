// RF46 - Prescrição de exame pelo médico
export interface CriarExameUtenteDTO {
    utente: { id: number };
    medico: { id: number };
    exame: { id: number };
    data_exame: string;
}

// RF47 - Registo de resultado de exame
export interface RegistarResultadoExameDTO {
    resultado: string;
    interpretacao: string;
}

export interface ExameUtenteRespostaDTO {
    id: number;
    data_exame: string;
    data_resultado: Date | null;
    resultado: string | null;
    interpretacao: string | null;
    utente: { id: number; nome: string };
    medico: { id: number; nome: string };
    exame: { id: number; nome_exame: string };
}