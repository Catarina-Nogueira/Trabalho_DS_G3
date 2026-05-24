// src/dtos/carat.dto.ts

// ---------------------------------------------------------------------------
// DTO de submissão — cada resposta tem a questão e a opção escolhida
// ---------------------------------------------------------------------------

export interface RespostaItemDto {
    id_questao: number;
    id_opcao: number;
}

export interface SubmeterAvaliacaoDto {
    id_questionario: number;
    respostas: RespostaItemDto[];
}

// ---------------------------------------------------------------------------
// DTOs de criação (Administrador)
// ---------------------------------------------------------------------------

export interface CriarQuestionarioDto {
    versao: string;
    data_ativacao: string; // formato YYYY-MM-DD
}

export interface CriarQuestaoDto {
    id_questionario: number;
    texto_questao: string;
}

export interface CriarOpcaoRespostaDto {
    id_questao: number;
    texto_opcao: string;
    score: number;
}