import { Request, Response } from 'express';
import { AutenticacaoService } from '../services/autenticacao.services';

export const AutenticacaoController = {

    // POST /auth/login
    // RF01 — Autenticação do utilizador
    login: async (req: Request, res: Response) => {
        const { username, password } = req.body;

        if (!username) return res.status(400).json({ erro: 'username é obrigatório.' });
        if (!password) return res.status(400).json({ erro: 'password é obrigatória.' });

        try {
            const resultado = await AutenticacaoService.login({ username, password });
            res.json(resultado);
        } catch (err: any) {
            // Mensagem genérica para não revelar se o username existe (segurança)
            res.status(401).json({ erro: err.message });
        }
    },

    // POST /auth/logout
    // RF03 — Logout
    logout: async (req: Request, res: Response) => {
        try {
            const resultado = await AutenticacaoService.logout();
            res.json(resultado);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao terminar sessão.' });
        }
    },
};