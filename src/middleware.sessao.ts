import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../src/dtos/autenticacao.dto'; 
import { Tipo_Utilizador } from '../src/models/utilizador.entity';

const JWT_SECRET = 'chave_segura'; // Em produção, usar process.env.JWT_SECRET para segurança

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                tipo_utilizador: Tipo_Utilizador;
                id_perfil_especifico?: number | undefined; 
            };
        }
    }
}

export const autenticarSessao = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            erro: 'Acesso negado. Token de autenticação em falta ou mal formatado.' 
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            erro: 'Acesso negado. Token de autenticação mal formatado ou ausente.' 
        });
    }

    try {
        // Agora o TypeScript sabe a 100% que 'token' é uma string e não vai dar erro de overload!
        const descodificado = jwt.verify(token, JWT_SECRET!) as unknown as TokenPayload;
        
        req.user = {
            id: descodificado.id_utilizador,
            tipo_utilizador: descodificado.tipo_utilizador,
            id_perfil_especifico: descodificado.id_perfil_especifico
        };

        return next();
    } catch (err) {
        return res.status(401).json({ erro: 'Sessão inválida ou expirada. Efetue login novamente.' });
    }
};