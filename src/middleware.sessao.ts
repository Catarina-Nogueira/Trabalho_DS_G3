// src/middlewares/sessao.middleware.ts
import { Request, Response, NextFunction } from 'express';

// Estender o tipo Request do Express para aceitar o nosso objeto de sessão
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                tipo_utilizador: string;
            };
        }
    }
}

export const autenticarSessao = (req: Request, res: Response, next: NextFunction) => {
    // O Express converte automaticamente todos os headers para letras minúsculas
    const executorId = req.headers['x-user-id'];
    const executorTipo = req.headers['x-user-tipo'];

    // Se não enviarem os headers, bloqueia logo aqui
    if (!executorId || !executorTipo) {
        return res.status(401).json({ 
            erro: 'Acesso negado. Headers de identificação em falta (x-user-id, x-user-tipo).' 
        });
    }

    // Injeta os dados no objeto 'req' para os controladores usarem
    req.user = {
        id: Number(executorId),
        tipo_utilizador: String(executorTipo)
    };

    // Avança para o controlador
    next();
};