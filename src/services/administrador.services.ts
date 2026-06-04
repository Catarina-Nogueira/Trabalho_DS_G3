import { AppDataSource } from '../database/database';
import { Administrador } from '../models/administrador.entity';
import { Utilizador } from '../models/utilizador.entity';
import { CriarAdministradorDTO, AtualizarAdministradorDTO, AdministradorRespostaDTO } from '../dtos/administrador.dto';
import { AuditoriaService } from './auditoria.services';
import { EntidadeAuditoria, AcaoAuditoria } from '../models/auditoria.entity';

const administradorRepo = AppDataSource.getRepository(Administrador);

export const AdministradorService = {

    listarTodos: async () => {
        return await administradorRepo.find({
            relations: ['utilizador'],
            select: {
                id: true,
                nome: true,
                utilizador: { id: true, email: true, username: true, data_criacao: true }
            }
        });
    },

    buscarPorId: async (id: number) => {
        if (!id || id <= 0) throw new Error('ID inválido');
        
        const administrador = await administradorRepo.findOne({
            where: { id },
            relations: ['utilizador'],
            select: {
                id: true,
                nome: true,
                utilizador: { id: true, email: true, username: true, data_criacao: true }
            }
        }); 
        if (!administrador) throw new Error('Administrador não encontrado');
        return administrador;
    },

    criar: async (id_utilizador: number, dados: CriarAdministradorDTO, idUtilizadorLogado: number): Promise<AdministradorRespostaDTO> => {
        if (!id_utilizador || id_utilizador <= 0) {
            throw new Error('ID de utilizador inválido ou não fornecido');
        }
        if (!dados.nome) {
            throw new Error('O nome do administrador é obrigatório');
        }
        
        dados.nome = dados.nome.trim();
        
        const existente = await administradorRepo.findOne({ where: { nome: dados.nome } });
        if (existente) {
            throw new Error('Já existe um administrador com este nome');
        }

        
        const novoAdministrador = administradorRepo.create({
            nome: dados.nome,
            utilizador: { id: id_utilizador } as Utilizador
        });

        const administradorGuardado = await administradorRepo.save(novoAdministrador);

        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: EntidadeAuditoria.ADMINISTRADOR,
            acao: AcaoAuditoria.CRIAR
        });

        const administradorCompleto = await administradorRepo.findOne({
            where: { id: administradorGuardado.id },
            relations: ['utilizador'],
            select: {
                id: true,
                nome: true,
                utilizador: { id: true, email: true, username: true, data_criacao: true }
            }
        });

        return {
            id: administradorCompleto!.id,
            nome: administradorCompleto!.nome,
            utilizador: {
                id: administradorCompleto!.utilizador.id,
                email: administradorCompleto!.utilizador.email,
                username: administradorCompleto!.utilizador.username,
                data_criacao: administradorCompleto!.utilizador.data_criacao.toISOString()
            }
        };
    },

    atualizar: async (id: number, dados: AtualizarAdministradorDTO, idUtilizadorLogado: number) => {
        if (!id || id <= 0) throw new Error('ID inválido');

        const administrador = await administradorRepo.findOne({ where: { id }, relations: ['utilizador'] });
        if (!administrador) throw new Error('Administrador não encontrado');

        if (dados.nome) {
            administrador.nome = dados.nome.trim();
        }

        const resultado = await administradorRepo.save(administrador);

        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: EntidadeAuditoria.ADMINISTRADOR,
            acao: AcaoAuditoria.ATUALIZAR
        });

        return resultado;
    },

    eliminar: async (id: number, idUtilizadorLogado: number) => {
        if (!id || id <= 0) throw new Error('ID inválido');
        
        const administrador = await administradorRepo.findOneBy({ id });
        if (!administrador) throw new Error('Administrador não encontrado');

        await administradorRepo.remove(administrador);

        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: EntidadeAuditoria.ADMINISTRADOR,
            acao: AcaoAuditoria.ELIMINAR
        });

        return {
            mensagem: 'Administrador eliminado com sucesso'
        };
    }
};