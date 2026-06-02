import { AppDataSource } from '../database/database';
import { Utilizador, Estado } from '../models/utilizador.entity';
import { CriarUtilizadorDTO, AtualizarUtilizadorDTO, UtilizadorRespostaDTO } from '../dtos/utilizador.dto';
import { AutenticacaoService } from './autenticacao.services';

const utilizadorRepo = () => AppDataSource.getRepository(Utilizador);

// Converte entidade para DTO de resposta (nunca expõe a password)
const toResposta = (u: Utilizador): UtilizadorRespostaDTO => ({
    id: u.id,
    username: u.username,
    email: u.email,
    tipo_utilizador: u.tipo_utilizador as any,
    estado: u.estado as any,
    data_criacao: u.data_criacao?.toISOString(),
    data_ultimo_acesso: u.data_ultimo_acesso?.toISOString(),
});

export const UtilizadorService = {

    // Devolve todos os utilizadores (sem password)
    listarTodos: async (): Promise<UtilizadorRespostaDTO[]> => {
        const utilizadores = await utilizadorRepo().find();
        return utilizadores.map(toResposta);
    },

    // Devolve um utilizador pelo id (sem password)
    buscarPorId: async (id: number): Promise<UtilizadorRespostaDTO | null> => {
        const utilizador = await utilizadorRepo().findOneBy({ id });
        if (!utilizador) return null;
        return toResposta(utilizador);
    },

    // Cria um novo utilizador — estado inicial sempre ATIVO (RF07)
    criar: async (dados: CriarUtilizadorDTO): Promise<UtilizadorRespostaDTO> => {
        // Verificar se o email já existe
        const existe = await utilizadorRepo().findOneBy({ email: dados.email });
        if (existe) throw new Error('Já existe um utilizador com este email.');

        const usernameExiste = await utilizadorRepo().findOneBy({ username: dados.username });
        if (usernameExiste) throw new Error('Já existe um utilizador com este username.');

        const passwordEncriptada = await AutenticacaoService.encriptarPassword(dados.password);

        const utilizador = utilizadorRepo().create({
            username: dados.username,
            email: dados.email,
            tipo_utilizador: dados.tipo_utilizador,
            estado: Estado.ATIVO, // sempre começa como ativo
            password: passwordEncriptada,
        });      

        const guardado = await utilizadorRepo().save(utilizador);
        return toResposta(guardado);
    },

    // Atualiza email, password ou estado (RF04, RF08)
    atualizar: async (id: number, dados: AtualizarUtilizadorDTO, utilizadorSessao: {id: number; tipo_utilizador: string }): Promise<UtilizadorRespostaDTO | null> => {
        const utilizadoralvo = await utilizadorRepo().findOneBy({ id });
        if (!utilizadoralvo) return null;

        const ehOProprio = utilizadorSessao.id === utilizadoralvo.id;
        const ehAdmin = utilizadorSessao.tipo_utilizador.toLowerCase() === 'administrador';

        if (!ehOProprio && !ehAdmin) {
            throw new Error('Acesso negado. Não pode alterar dados de outros utilizadores.');
        }

        // Se está a mudar o email, verificar que o novo não está em uso
        if (dados.email && dados.email !== utilizadoralvo.email) {
            const existe = await utilizadorRepo().findOneBy({ email: dados.email });
            if (existe) throw new Error('Já existe um utilizador com este email.');
        }

        if (dados.username && dados.username !== utilizadoralvo.username) {
            const existe = await utilizadorRepo().findOneBy({ username: dados.username });
            if (existe) throw new Error('Já existe um utilizador com este username.');
        }

        // Se enviou uma nova password, encripta-a primeiro
        if (dados.password) {
            dados.password = await AutenticacaoService.encriptarPassword(dados.password);
        }

        await utilizadorRepo().update(id, dados);
        const atualizado = await utilizadorRepo().findOneBy({ id });
        return atualizado ? toResposta(atualizado) : null;
    },

    // Desativa a conta sem eliminar os dados (RF08)
    desativar: async (id: number, utilizadorSessao: { id: number; tipo_utilizador: string }): Promise<UtilizadorRespostaDTO | null> => {
        
        if (utilizadorSessao.tipo_utilizador.toLowerCase() !== 'administrador') {
            throw new Error('Acesso negado. Apenas administradores podem desativar contas.');
        }
        
        const utilizador = await utilizadorRepo().findOneBy({ id });
        if (!utilizador) return null;
        if (utilizador.estado === Estado.INATIVO) throw new Error('A conta já está desativada.');

        await utilizadorRepo().update(id, { estado: Estado.INATIVO });
        const atualizado = await utilizadorRepo().findOneBy({ id });
        return atualizado ? toResposta(atualizado) : null;
    },

    eliminar: async (
        id: number, 
        utilizadorSessao: { id: number; tipo_utilizador: string }
    ): Promise<void> => {
        
        // Regra de Permissão: Segurança dupla na remoção física da BD
        if (utilizadorSessao.tipo_utilizador.toLowerCase() !== 'administrador') {
            throw new Error('Acesso negado. Apenas administradores podem eliminar contas do sistema.');
        }

        const utilizador = await utilizadorRepo().findOneBy({ id });
        if (!utilizador) throw new Error('Utilizador não encontrado.');
        
        await utilizadorRepo().delete(id);
    },
};