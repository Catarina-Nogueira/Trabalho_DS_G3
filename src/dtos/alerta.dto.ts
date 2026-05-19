export interface CriarAlertaDTO {
    id_utente: number;
    id_medico: number;
    tipo: string;
    motivo: string;
    id_avaliacao?: number;
    id_sintoma?: number;
}

// O médico só pode atualizar o estado do alerta
export interface AtualizarAlertaDTO {
    estado: 'novo' | 'visto' | 'em_seguimento' | 'fechado';
}

// deve-se por o id_avaliacao e id-sintoma?
export interface AlertaRespostaDTO {
    id: number;
    tipo: string;
    prioridade: string;
    estado: string;
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
}