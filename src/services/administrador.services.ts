import { AppDataSource } from '../database/database';
import { Administrador } from '../models/administrador.entity';

const administradorRepo = AppDataSource.getRepository(Administrador);

export const AdministradorService = {

    // Listar todos os administradores
    listarTodos: async () => {
        return await administradorRepo.find({
            select: {
                id: true,
                nome: true,
            }
        });
    },

    // Consulta de detalhe de administrador
    buscarPorId: async (id: number) => {
        return await administradorRepo.findOne({
            where: { id },
            select: {
                id: true,
                nome: true,
            }
        });
    },

    // Criar administrador
    criar: async (dados: Partial<Administrador>) => {
        const administrador = administradorRepo.create(dados);
        return await administradorRepo.save(administrador);
    },

    eliminar: async (id: number) => {
        return await administradorRepo.delete(id);
    }
};