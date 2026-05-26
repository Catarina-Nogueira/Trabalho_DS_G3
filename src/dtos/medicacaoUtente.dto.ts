import { Medicacao_Utente } from '../models/medicacaoUtente.entity';

// RF43 - Prescrição de medicação pelo médico
export interface CriarMedicacaoUtenteDTO {
    utente: { id: number };
    medico: { id: number };
    medicacao: { id: number };
    frequencia: string;
    data_inicio: string;
    duracao: string;
}

export interface AtualizarMedicacaoUtenteDTO {
    frequencia?: string;
    duracao?: string;
}

// RF44 - Encerramento de prescrição
export interface EncerrarMedicacaoUtenteDTO {
    ativo: false;
}

export interface MedicacaoUtenteRespostaDTO {
    id: number;
    frequencia: string;
    data_inicio: string;
    duracao: string;
    ativo: boolean;
    utente: { id: number; nome: string };
    medico: { id: number; nome: string };
    medicacao: { id: number; nome_medicamento: string };
}