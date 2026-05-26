// src/dtos/configuracao.dto.ts

// RF12 — Criar novo parâmetro de configuração
export interface CriarConfiguracaoDto {
    nome_parametro: string;
    valor_limiar: number;
    descricao: string;
}

// RF11, RF13 — Atualizar parâmetro existente
export interface AtualizarConfiguracaoDto {
    nome_parametro?: string;
    valor_limiar: number;
    descricao?: string;
}

// DTO de resposta — o que a API devolve
export interface ConfiguracaoRespostaDto {
    id: number;
    nome_parametro: string;
    valor_limiar: number;
    descricao: string;
    data_atualizacao: Date;
    administrador: { id: number; nome: string };
}

