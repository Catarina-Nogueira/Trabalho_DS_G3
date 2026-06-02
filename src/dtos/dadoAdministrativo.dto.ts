export interface CriarDadoAdministrativoDTO {
    morada: string;
    nif: number;
    telemovel: string;
}

export interface AtualizarDadoAdministrativoDTO {
    morada?: string;
    telemovel?: string; 
}