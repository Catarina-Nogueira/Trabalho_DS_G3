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
    // Encontra qual a entidade com base no início do caminho da rota
    const rotaBase = Object.keys(mapeamentoEntidades).find(rota => url.startsWith(rota));
    
    const entidade = rotaBase ? mapeamentoEntidades[rotaBase] : null;
    let acao = mapeamentoAcoes[metodo] || null;

    // Ajuste específico para rotas de Login/Logout
    if (url.includes('/autenticacao/login')) acao = AcaoAuditoria.LOGIN;
    if (url.includes('/autenticacao/logout')) acao = AcaoAuditoria.LOGOUT;

    return { entidade, acao };
};