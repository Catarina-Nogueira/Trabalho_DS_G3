import { Request, Response, NextFunction } from 'express';
import { AuditoriaService } from '../services/auditoria.services';
import { obterDadosAuditoria } from './auditoria.mapeamento';

export const auditoriaAutomaticaMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const resSendOriginal = res.send;

    // Usamos 'any' no argumento para aceitar strings, objetos ou Buffers sem queixas do TS
    res.send = function (body: any): Response {
        
        // Executa primeiro a lógica da resposta original do Express
        const responseJson = resSendOriginal.call(this, body);

        // Captura o estado no momento exato em que a resposta é finalizada
        const operacaoComSucesso = res.statusCode >= 200 && res.statusCode < 300;
        const id_utilizador = req.user?.id;

        if (operacaoComSucesso && id_utilizador) {
            const { entidade, acao } = obterDadosAuditoria(req.originalUrl, req.method);

            if (entidade && acao) {
                // Execução totalmente assíncrona em background (não bloqueia a resposta do utilizador)
                AuditoriaService.registar({
                    id_utilizador,
                    entidade_afetada: entidade,
                    acao: acao
                }).catch(err => console.error('Erro na auditoria automática:', err));
            }
        }

        return responseJson;
    };

    next();
};