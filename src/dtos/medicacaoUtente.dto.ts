export interface CriarMedicacaoUtenteDTO {
    utente: { id: number };
    medico: { id: number };
    medicacao: { id: number };
    frequencia: string;
    data_inicio: string;
    duracao: string;
    dosagem: string;
}

export interface AtualizarMedicacaoUtenteDTO {
    frequencia?: string | undefined; 
    duracao?: string | undefined;    
    dosagem?: string | undefined;    
}

export interface EncerrarMedicacaoUtenteDTO {
    ativo: false;
}

export interface MedicacaoUtenteRespostaDTO {
    id: number;
    frequencia: string;
    data_inicio: string;
    duracao: string;
    dosagem: string;
    ativo: boolean;
    utente: { id: number; nome: string };
    medico: { id: number; nome: string };
    medicacao: { id: number; nome_medicamento: string };
}