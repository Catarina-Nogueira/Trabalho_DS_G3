// src/dtos/configuracao.dto.ts

// RF12 — Criar novo parâmetro de configuração
export interface CriarConfiguracaoDTO {
    nome_parametro: string;
    valor_limiar: number;
    descricao: string;
}

// RF11, RF13 — Atualizar parâmetro existente
export interface AtualizarConfiguracaoDTO {
    valor_limiar?: number | undefined;
    descricao?: string;
}

// DTO de resposta — o que a API devolve
export interface ConfiguracaoRespostaDTO {
    id: number;
    nome_parametro: string;
    valor_limiar: number;
    descricao: string;
    data_atualizacao: Date;
    administrador: { id: number; nome: string };
}

