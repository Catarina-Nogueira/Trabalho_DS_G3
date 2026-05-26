import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TokenPayload} from './dtos/autenticacao.dto';

const JWT_SECRET = process.env.JWT_SECRET || 'saudinob_secret_key';

// Extender Request do Express
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

// Middleware de autenticação
export const autenticar = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const authHeader = req.headers.authorization;

    // Authorization: Bearer token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            erro: 'Token em falta. Faça login primeiro.'
        });
    }


    const token = authHeader.split(' ')[1];

    if (!token) {
    return res.status(401).json({ erro: 'Token inválido.' });
    }

    try {

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        ) as JwtPayload;

        req.user = {
            id_utilizador: decoded.id_utilizador,
            tipo_utilizador: decoded.tipo_utilizador
        };

        next();

    } catch (err) {

        return res.status(401).json({
            erro: 'Token inválido ou expirado.'
        });

    }
};

// Middleware de autorização
export const autorizar = (...perfis: string[]) => {

    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        if (!req.user) {
            return res.status(401).json({
                erro: 'Não autenticado.'
            });
        }

        if (!perfis.includes(req.user.tipo_utilizador)) {
            return res.status(403).json({
                erro: 'Não tem permissão.'
            });
        }

        next();
    };
};