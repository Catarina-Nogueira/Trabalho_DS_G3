export interface CriarHistoriaFamiliarDTO {
    nome: string;       
    descricao: string;   
}

export interface AtualizarHistoriaFamiliarDTO {
    nome?: string;
    descricao?: string;
}