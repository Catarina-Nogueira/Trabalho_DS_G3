import { Request, Response } from 'express';
import { AdministradorService } from '../services/administrador.services';

export const AdministradorController = {

    listarTodos: async (req: Request, res: Response) => {
        try {
            const administradores = await AdministradorService.listarTodos();
            res.json(administradores);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao listar administradores' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const administrador = await AdministradorService.buscarPorId(Number(req.params.id));
            if (!administrador) return res.status(404).json({ erro: 'Administrador não encontrado' });
            res.json(administrador);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar administrador' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const administrador = await AdministradorService.criar(req.body);
            res.status(201).json(administrador);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao criar administrador' });
        }
    },
   

    eliminar: async (req: Request, res: Response) => {
        try {
            await AdministradorService.eliminar(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao eliminar administrador' });
        }
    }
};