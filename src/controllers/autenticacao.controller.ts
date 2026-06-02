import { Request, Response } from 'express';
import { AutenticacaoService } from '../services/autenticacao.services';

export const AutenticacaoController = {

    
    // RF01 — Autenticação do utilizador
    login: async (req: Request, res: Response) => {
        const { username, password } = req.body;

        if (!username) return res.status(400).json({ erro: 'username é obrigatório.' });
        if (!password) return res.status(400).json({ erro: 'password é obrigatória.' });

        try {
            const dadosAutenticacao = await AutenticacaoService.login({ username, password });
            return res.json({
                mensagem: 'Autenticação bem-sucedida.',
                utilizador: dadosAutenticacao
            });
        } catch (err: any) {
            // Mensagem genérica para não revelar se o username existe (segurança)
            res.status(401).json({ erro: err.message });
        }
    },

    // RF03 — Logout
   logout: async (req: Request, res: Response) => {
        // Sem tokens ou sessões no servidor, o logout passa a ser apenas o cliente
        // a limpar o estado da aplicação ou a redirecionar para a página de login.
        return res.json({ mensagem: 'Sessão terminada.' });
    },
};