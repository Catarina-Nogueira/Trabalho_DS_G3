export interface CriarSintomaReportadoDTO {
    nivel_mal_estar_geral: number;  // 0 a 3
    sintomas_pulmonares: number;    // 0 a 3
    sintomas_nasais: number;        // 0 a 3
    interrupcao_sono: number;       // 0 a 3
    uso_medicacao_resgate: number;  // 0 ou 1
    gatilho_identificavel: number;  // 0, 2, 3 ou 4
    notas_adicionais?: string;
}

export interface SintomaReportadoRespostaDTO {
    id: number;
    data_registo: string;
    nivel_mal_estar_geral: string;
    sintomas_pulmonares: string;
    sintomas_nasais: string;
    interrupcao_sono: string;
    uso_medicacao_resgate: string;
    gatilho_identificavel: string;
    notas_adicionais: string | null;
}