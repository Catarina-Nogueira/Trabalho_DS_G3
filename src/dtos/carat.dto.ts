export interface RespostaDTO {
    id_questao: number;
    id_opcao: number;
}

export interface SubmeterAvaliacaoDTO {
    id_utente: number;
    id_questionario: number;
    respostas: RespostaDTO[];
}