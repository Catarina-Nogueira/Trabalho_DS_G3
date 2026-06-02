export interface LembreteExameRespostaDTO {
    exame_utente_id: number;
    data_exame: string;
    hora_exame: string;
    utente: {
        id: number;
        nome: string;
        email: string;
    };
    medico: {
        id: number;
        nome: string;
    };
    exame: {
        id: number;
        nome_exame: string;
        tipo: string;
    };
}