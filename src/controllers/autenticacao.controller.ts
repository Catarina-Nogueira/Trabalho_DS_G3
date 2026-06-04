import { Request, Response } from 'express';
import { AutenticacaoService } from '../services/autenticacao.services';

export const AutenticacaoController = {

    login: async (req: Request, res: Response) => {
        const { username, password } = req.body;

        if (!username) return res.status(400).json({ erro: 'O campo username é obrigatório.' });
        if (!password) return res.status(400).json({ erro: 'O campo password é obrigatório.' });

        try {
            const dadosAutenticacao = await AutenticacaoService.login({ username, password });
            
            return res.json({
                mensagem: 'Autenticação bem-sucedida.',
                ...dadosAutenticacao
            });
        } catch (err: any) {
            // Mantém a opacidade de erro para evitar engenharia social / colheita de utilizadores
            return res.status(401).json({ erro: err.message || 'Credenciais de acesso incorretas.' });
        }
    },

    logout: async (req: Request, res: Response) => {
        // Com JWT estruturado de forma stateless, o logout passa puramente pelo cliente
        // destruir o token armazenado (no LocalStorage, SessionStorage ou Cookies).
        return res.json({ mensagem: 'Sessão terminada com sucesso. O token foi invalidado.' });
    }
};