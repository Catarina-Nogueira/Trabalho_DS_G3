import { EntidadeAuditoria, AcaoAuditoria } from '../models/auditoria.entity';

// Mapeia o início das rotas para as respetivas entidades
const mapeamentoEntidades: Record<string, EntidadeAuditoria> = {
    '/utentes': EntidadeAuditoria.UTENTE,
    '/medicos': EntidadeAuditoria.MEDICO,
    '/configuracoes': EntidadeAuditoria.CONFIGURACAO,
    '/exames': EntidadeAuditoria.EXAME_UTENTE,
    '/medicacao': EntidadeAuditoria.MEDICACAO_UTENTE,
    '/medicacaoUtente': EntidadeAuditoria.MEDICACAO_UTENTE,
    '/exameUtente': EntidadeAuditoria.EXAME_UTENTE,
    '/alertas': EntidadeAuditoria.ALERTA,
    '/questionarios': EntidadeAuditoria.QUESTIONARIO_CARAT,
    '/carat': EntidadeAuditoria.AVALIACAO_CARAT,
    '/sintomas': EntidadeAuditoria.SINTOMA_REPORTADO,
    '/autenticacao': EntidadeAuditoria.UTILIZADOR
};

// Mapeia os métodos HTTP para as respetivas ações
const mapeamentoAcoes: Record<string, AcaoAuditoria> = {
    'POST': AcaoAuditoria.CRIAR,
    'PUT': AcaoAuditoria.ATUALIZAR,
    'PATCH': AcaoAuditoria.ATUALIZAR,
    'DELETE': AcaoAuditoria.ELIMINAR,
    'GET': AcaoAuditoria.CONSULTAR
};

export const obterDadosAuditoria = (url: string, metodo: string) => {
    // Remove parâmetros de query (?ativo=true) para não corromper o match do URL
    const urlLimpo = url.split('?')[0] || url; // Garante que temos uma string mesmo que split retorne undefined

    // Encontra a rota base permitindo sub-rotas ou prefixos como /api/utentes
    const rotaBase = Object.keys(mapeamentoEntidades).find(rota => urlLimpo.includes(rota));
    
    const entidade = rotaBase ? mapeamentoEntidades[rotaBase] : null;
    let acao = mapeamentoAcoes[metodo] || null;

    if (urlLimpo.includes('/autenticacao/login')) acao = AcaoAuditoria.LOGIN;
    if (urlLimpo.includes('/autenticacao/logout')) acao = AcaoAuditoria.LOGOUT;

    return { entidade, acao };
};