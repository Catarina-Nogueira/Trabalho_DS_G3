export interface CriarUtenteDTO {
    nome: string;
    data_nascimento: string;
    sexo_biologico: 'feminino' | 'masculino';
    utilizador: { id: number };
    medico: { id: number };
}

export interface AtualizarUtenteDTO {
    nome?: string;
    sexo_biologico?: 'feminino' | 'masculino';
    medico?: { id: number };  
}

export interface UtenteRespostaDTO {
    id: number;
    nome: string;
    data_nascimento: string;
    sexo_biologico: string;
    utilizador: { id: number; email: string };
    medico: { id: number; nome: string; especialidade: string };
    data_atualizacao: Date;
}