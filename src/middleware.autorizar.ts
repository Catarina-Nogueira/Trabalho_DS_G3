// src/middlewares/autorizar.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const autorizarSessao = (...perfisPermitidos: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        
        // 1. Verificar se o utilizador passou primeiro pelo autenticarSessao
        if (!req.user) {
            return res.status(401).json({
                erro: 'Não autenticado. Identificação em falta.'
            });
        }

        // 2. Verificar se o tipo de utilizador atual tem permissão para esta rota
        // Fazemos lowercase para evitar problemas se escreveres 'Administrador' ou 'administrador'
        const perfilUtilizador = req.user.tipo_utilizador.toLowerCase();
        const perfisPermitidosLower = perfisPermitidos.map(p => p.toLowerCase());

        if (!perfisPermitidosLower.includes(perfilUtilizador)) {
            return res.status(403).json({
                erro: 'Acesso proibido. Não tem permissões para aceder a este recurso.'
            });
        }

        // Se estiver tudo bem, avança para o controlador
        next();
    };
};