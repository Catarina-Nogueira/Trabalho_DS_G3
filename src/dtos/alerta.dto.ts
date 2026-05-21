import { EstadoAlerta, PrioridadeAlerta, TipoAlerta } from "../models/alerta.entity";

// O médico só pode atualizar o estado
export interface AtualizarAlertaDTO {
    estado: EstadoAlerta;
}

// O que a API devolve
export interface AlertaRespostaDTO {
    id: number;
    tipo: TipoAlerta;
    prioridade: PrioridadeAlerta
    estado: EstadoAlerta;
    motivo: string;
    data_criacao: Date;
    data_atualizacao: Date;
    utente: {
        id: number;
        nome: string;
    };
    medico: {
        id: number;
        nome: string;
    };
    id_avaliacao?: number | null;  // útil para o médico saber de onde veio o alerta
    id_sintoma?: number | null;    // útil para o médico saber de onde veio o alerta
}