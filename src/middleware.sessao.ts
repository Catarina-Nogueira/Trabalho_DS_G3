import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../src/dtos/autenticacao.dto'; // Garante que o path do import está correto
import { Tipo_Utilizador } from '../src/models/utilizador.entity';

const JWT_SECRET = 'sua_chave_secreta_super_segura_123';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                tipo_utilizador: Tipo_Utilizador; // 👈 Atualizado para usar o Enum estrito
                id_perfil_especifico?: number | undefined; // 👈 Adicionado '| undefined' para satisfazer o exactOptionalPropertyTypes
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

    try {
        
        const descodificado = jwt.verify(token, JWT_SECRET) as unknown as TokenPayload;
        
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