import { AppDataSource } from '../database/database';
import { Utilizador, Estado, Tipo_Utilizador } from '../models/utilizador.entity';
import { CriarUtilizadorDTO, AtualizarUtilizadorDTO, UtilizadorRespostaDTO } from '../dtos/utilizador.dto';
import { AutenticacaoService } from './autenticacao.services';
import { AuditoriaService } from './auditoria.services';
import { EntidadeAuditoria, AcaoAuditoria } from '../models/auditoria.entity';

const utilizadorRepo = () => AppDataSource.getRepository(Utilizador);

const toResposta = (u: Utilizador): UtilizadorRespostaDTO => ({
    id: u.id,
    username: u.username,
    email: u.email,
    tipo_utilizador: u.tipo_utilizador, // Removido o 'as any' desnecessário
    estado: u.estado,                   // Removido o 'as any' desnecessário
    data_criacao: u.data_criacao?.toISOString(),
    data_ultimo_acesso: u.data_ultimo_acesso?.toISOString(),
});

export const UtilizadorService = {

    listarTodos: async (): Promise<UtilizadorRespostaDTO[]> => {
        const utilizadores = await utilizadorRepo().find();
        return utilizadores.map(toResposta);
    },

    buscarPorId: async (id: number): Promise<UtilizadorRespostaDTO | null> => {
        const utilizador = await utilizadorRepo().findOneBy({ id });
        if (!utilizador) return null;
        return toResposta(utilizador);
    },

    criar: async (dados: CriarUtilizadorDTO, idUtilizadorLogado: number): Promise<UtilizadorRespostaDTO> => {
        if (!dados.email) throw new Error('O email do utilizador é obrigatório.');

        const existe = await utilizadorRepo().findOneBy({ email: dados.email });
        if (existe) throw new Error('Já existe um utilizador com este email.');

        const usernameExiste = await utilizadorRepo().findOneBy({ username: dados.username });
        if (usernameExiste) throw new Error('Já existe um utilizador com este username.');

        const passwordEncriptada = await AutenticacaoService.encriptarPassword(dados.password);

        const utilizador = utilizadorRepo().create({
            username: dados.username,
            email: dados.email,
            tipo_utilizador: dados.tipo_utilizador,
            estado: Estado.ATIVO,
            password: passwordEncriptada,
        });      

        const guardado = await utilizadorRepo().save(utilizador);

        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: EntidadeAuditoria.UTILIZADOR,
            acao: AcaoAuditoria.CRIAR
        });

        return toResposta(guardado);
    },

    atualizar: async (id: number, dados: AtualizarUtilizadorDTO, utilizadorSessao: { id: number; tipo_utilizador: Tipo_Utilizador }): Promise<UtilizadorRespostaDTO | null> => {
        const utilizadoralvo = await utilizadorRepo().findOneBy({ id });
        if (!utilizadoralvo) return null;

        const ehOProprio = utilizadorSessao.id === utilizadoralvo.id;
        const ehAdmin = utilizadorSessao.tipo_utilizador === Tipo_Utilizador.ADMINISTRADOR;

        if (!ehOProprio && !ehAdmin) {
            throw new Error('Acesso negado. Não pode alterar dados de outros utilizadores.');
        }

        if (dados.email && dados.email !== utilizadoralvo.email) {
            const existe = await utilizadorRepo().findOneBy({ email: dados.email });
            if (existe) throw new Error('Já existe um utilizador com este email.');
            utilizadoralvo.email = dados.email;
        }

        if (dados.username && dados.username !== utilizadoralvo.username) {
            const existe = await utilizadorRepo().findOneBy({ username: dados.username });
            if (existe) throw new Error('Já existe um utilizador com este username.');
            utilizadoralvo.username = dados.username;
        }

        if (dados.password) {
            utilizadoralvo.password = await AutenticacaoService.encriptarPassword(dados.password);
        }

        if (dados.estado && ehAdmin) {
            utilizadoralvo.estado = dados.estado;
        }

        const atualizado = await utilizadorRepo().save(utilizadoralvo);

        await AuditoriaService.registar({
            id_utilizador: utilizadorSessao.id,
            entidade_afetada: EntidadeAuditoria.UTILIZADOR,
            acao: AcaoAuditoria.ATUALIZAR
        });

        return toResposta(atualizado);
    },
    
    desativar: async (id: number, utilizadorSessao: { id: number; tipo_utilizador: Tipo_Utilizador }): Promise<UtilizadorRespostaDTO | null> => {
        if (utilizadorSessao.tipo_utilizador !== Tipo_Utilizador.ADMINISTRADOR) {
            throw new Error('Acesso negado. Apenas administradores podem desativar contas.');
        }
        
        const utilizador = await utilizadorRepo().findOneBy({ id });
        if (!utilizador) return null;
        if (utilizador.estado === Estado.INATIVO) throw new Error('A conta já está desativada.');

        utilizador.estado = Estado.INATIVO;
        const atualizado = await utilizadorRepo().save(utilizador);

        await AuditoriaService.registar({
            id_utilizador: utilizadorSessao.id,
            entidade_afetada: EntidadeAuditoria.UTILIZADOR,
            acao: AcaoAuditoria.ATUALIZAR
        });

        return toResposta(atualizado);
    },
    
    eliminar: async (id: number, utilizadorSessao: { id: number; tipo_utilizador: Tipo_Utilizador }): Promise<void> => {
        if (utilizadorSessao.tipo_utilizador !== Tipo_Utilizador.ADMINISTRADOR) {
            throw new Error('Acesso negado. Apenas administradores podem eliminar contas do sistema.');
        }

        const utilizador = await utilizadorRepo().findOneBy({ id });
        if (!utilizador) throw new Error('Utilizador não encontrado.');
        
        await utilizadorRepo().remove(utilizador);

        await AuditoriaService.registar({
            id_utilizador: utilizadorSessao.id,
            entidade_afetada: EntidadeAuditoria.UTILIZADOR,
            acao: AcaoAuditoria.ELIMINAR
        });
    },
};