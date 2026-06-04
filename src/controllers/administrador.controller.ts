import { Request, Response } from 'express';
import { AdministradorService } from '../services/administrador.services';
import { AtualizarAdministradorDTO, CriarAdministradorDTO } from '../dtos/administrador.dto';

export const AdministradorController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const administradores = await AdministradorService.listarTodos();
            return res.json(administradores);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao listar administradores' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const administrador = await AdministradorService.buscarPorId(Number(req.params.id));
            return res.json(administrador);
        } catch (err: any) {
            const status = err.message === 'Administrador não encontrado' ? 404 :
                           err.message === 'ID inválido' ? 400 : 500;
            return res.status(status).json({ erro: err.message });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const id_utilizador_logado = req.user!.id; // Quem está a criar
            const id_utilizador = Number(req.params.id_utilizador); // Alvo da conta
            const dadosDTO: CriarAdministradorDTO = req.body;

            if (!id_utilizador) {
                return res.status(400).json({ erro: 'O parâmetro id_utilizador na URL é obrigatório.' });
            }

            // Passagem do id_utilizador_logado corrigida
            const administrador = await AdministradorService.criar(id_utilizador, dadosDTO, id_utilizador_logado);
            return res.status(201).json(administrador);
        } catch (err: any) {
            const status = err.message.includes('obrigatório') ? 400 :
                           err.message.includes('Já existe') ? 409 : 500;
            return res.status(status).json({ erro: err.message });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const id_utilizador_logado = req.user!.id; // Autor da ação
            const id = Number(req.params.id);
            const dadosDTO: AtualizarAdministradorDTO = req.body;
            
            // Passagem do id_utilizador_logado corrigida
            const administradorAtualizado = await AdministradorService.atualizar(id, dadosDTO, id_utilizador_logado);
            return res.json(administradorAtualizado);
        } catch (err: any) {
            const status = err.message === 'Administrador não encontrado' ? 404 :
                           err.message === 'ID inválido' ? 400 : 500;
            return res.status(status).json({ erro: err.message });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            const id_utilizador_logado = req.user!.id; // Autor da ação
            const id_alvo = Number(req.params.id);

            // Passagem do id_utilizador_logado corrigida
            const resultado = await AdministradorService.eliminar(id_alvo, id_utilizador_logado);
            return res.json(resultado);
        } catch (err: any) {
            const status = err.message === 'Administrador não encontrado' ? 404 :
                           err.message === 'ID inválido' ? 400 : 500;
            return res.status(status).json({ erro: err.message });
        }
    }
};