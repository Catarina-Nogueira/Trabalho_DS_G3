import { Request, Response, NextFunction } from 'express';
import { AuditoriaService } from '../services/auditoria.services';
import { obterDadosAuditoria } from './auditoria.mapeamento';

export const auditoriaAutomaticaMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Sobrescrevemos a função res.send nativa do Express para intercetar o fim da operação
    const resSendOriginal = res.send;

    res.send = function (body): Response {
        // Executa o envio da resposta original ao cliente imediatamente (para não atrasar a app)
        const responseJson = resSendOriginal.call(this, body);

        // Só auditamos se a operação teve sucesso (Status 2xx) e se temos um utilizador na sessão
        const operacaoComSucesso = res.statusCode >= 200 && res.statusCode < 300;
        const id_utilizador = req.user?.id;

        if (operacaoComSucesso && id_utilizador) {
            const { entidade, acao } = obterDadosAuditoria(req.originalUrl, req.method);

            // Se a rota pertencer a uma entidade mapeada, grava o log de forma assíncrona
            if (entidade && acao) {
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