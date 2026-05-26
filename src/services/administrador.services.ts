import { AppDataSource } from '../database/database';
import { Administrador } from '../models/administrador.entity';
import { CriarAdministradorDTO, AtualizarAdministradorDTO, AdministradorRespostaDTO } from '../dtos/administrador.dto';

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
        if (!id || id <= 0) {
            throw new Error('ID inválido');
        }
        const administrador = await administradorRepo.findOne({
            where: { id },
            select: {
                id: true,
                nome: true,
            }
        }); 
        if (!administrador) {
            throw new Error('Administrador não encontrado');
        }
        return administrador;
    },

    // Criar administrador
    criar: async (dados: CriarAdministradorDTO): Promise<AdministradorRespostaDTO> => {
        if (!dados.nome) {
            throw new Error('O nome do administrador é obrigatório');
        }
        
        dados.nome = dados.nome.trim(); //remove espaços desnecessários.
        
        const existente = await administradorRepo.findOne({ 
            where: { 
                nome: dados.nome 
            } 
        });
        
        if (existente) {
            throw new Error('Já existe um administrador com este nome');
        }

        const novoAdministrador = administradorRepo.create({
            nome: dados.nome,
            utilizador: { 
                id: dados.utilizador.id 
            }
        
        });

        const administradorGuardado = await administradorRepo.save(novoAdministrador);

        // Buscar com relação para ter o email do utilizador
        const administradorCompleto = await administradorRepo.findOne({
            where: { id: administradorGuardado.id },
            relations: ['utilizador'],
            select: {
                id: true,
                nome: true,
                utilizador: {
                    id: true,
                    email: true
                }
            }
        });

        return {
            id: administradorCompleto!.id,
            nome: administradorCompleto!.nome,
            utilizador: {
                id: administradorCompleto!.utilizador.id,
                email: administradorCompleto!.utilizador.email
            }
        };
    },

// Atualizar Administrador
atualizar: async (id: number, dados: AtualizarAdministradorDTO) => {
    if (!id || id <= 0) {
        throw new Error('ID inválido');
    }

    const administrador = await administradorRepo.findOneBy({ id });
    if (!administrador) {
        throw new Error('Administrador não encontrado');
    }

    if (dados.nome) {
        administrador.nome = dados.nome.trim();
    }

    return await administradorRepo.save(administrador);
},

// Eliminar Administrador
    eliminar: async (id: number) => {
        if (!id || id <= 0) {
            throw new Error('ID inválido');
        }
        
        const administrador = await administradorRepo.findOneBy({ id });
        if (!administrador) {
            throw new Error('Administrador não encontrado');
        }

        const resultado = await administradorRepo.delete(id);
        if (resultado.affected === 0) {
            throw new Error('Falha ao eliminar o administrador');
        }

        return {
            mensagem: 'Administrador eliminado com sucesso',
            resultado
        };

    }
}