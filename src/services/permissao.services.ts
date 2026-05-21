import { AppDataSource } from '../database/database';
import { Permissao } from '../models/permissao.entity';

const permissaoRepo = AppDataSource.getRepository(Permissao);

export const PermissaoService = {

    // RF10 - Gestão de perfis e permissões (listar todas)
    listarTodos: async () => {
        return await permissaoRepo.find();
    },

    // RF10 - Consultar detalhe de uma permissão
    buscarPorId: async (id: number) => {
        return await permissaoRepo.findOne({
            where: { id }
        });
    },

    // RF10 - Gestão de perfis e permissões (criar)
    criar: async (dados: Partial<Permissao>) => {
        const permissao = permissaoRepo.create(dados);
        return await permissaoRepo.save(permissao);
    },

    // RF10 - Gestão de perfis e permissões (editar)
    atualizar: async (id: number, dados: Partial<Permissao>) => {
        await permissaoRepo.update(id, dados);
        return await permissaoRepo.findOne({
            where: { id }
        });
    },

    // RF10 - Gestão de perfis e permissões (eliminar)
    eliminar: async (id: number) => {
        return await permissaoRepo.delete(id);
    }

};