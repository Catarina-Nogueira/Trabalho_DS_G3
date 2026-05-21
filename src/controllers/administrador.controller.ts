import { Request, Response } from 'express';
import { AdministradorService } from '../services/administrador.services';
import { CriarAdministradorDTO } from '../dtos/administrador.dto';

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
            const dados: CriarAdministradorDTO = req.body;
            const administrador = await AdministradorService.criar(dados);
            return res.status(201).json(administrador);
        } catch (err: any) {
            const status = err.message.includes('obrigatório') ? 400 :
                           err.message.includes('Já existe') ? 409 : 500;
            return res.status(status).json({ erro: err.message });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            const resultado = await AdministradorService.eliminar(Number(req.params.id));
            return res.json(resultado);
        } catch (err: any) {
            const status = err.message === 'Administrador não encontrado' ? 404 :
                           err.message === 'ID inválido' ? 400 : 500;
            return res.status(status).json({ erro: err.message });
        }
    }
};