import { AppDataSource } from '../database/database';
import { Utilizador, Estado } from '../models/utilizador.entity';
import { CriarUtilizadorDTO, AtualizarUtilizadorDTO, UtilizadorRespostaDTO } from '../dtos/utilizador.dto';
import { AutenticacaoService } from './autenticacao.services';

const utilizadorRepo = () => AppDataSource.getRepository(Utilizador);

// Converte entidade para DTO de resposta (nunca expõe a password)
const toResposta = (u: Utilizador): UtilizadorRespostaDTO => ({
    id: u.id,
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

        const passwordEncriptada = await AutenticacaoService.encriptarPassword(dados.password);

        const utilizador = utilizadorRepo().create({
            email: dados.email,
            tipo_utilizador: dados.tipo_utilizador,
            estado: Estado.ATIVO, // sempre começa como ativo
            password: passwordEncriptada,
        });      

        const guardado = await utilizadorRepo().save(utilizador);
        return toResposta(guardado);
    },

    // Atualiza email, password ou estado (RF04, RF08)
    atualizar: async (id: number, dados: AtualizarUtilizadorDTO): Promise<UtilizadorRespostaDTO | null> => {
        const utilizador = await utilizadorRepo().findOneBy({ id });
        if (!utilizador) return null;

        // Se está a mudar o email, verificar que o novo não está em uso
        if (dados.email && dados.email !== utilizador.email) {
            const existe = await utilizadorRepo().findOneBy({ email: dados.email });
            if (existe) throw new Error('Já existe um utilizador com este email.');
        }

        await utilizadorRepo().update(id, dados);
        const atualizado = await utilizadorRepo().findOneBy({ id });
        return atualizado ? toResposta(atualizado) : null;
    },

    // Desativa a conta sem eliminar os dados (RF08)
    desativar: async (id: number): Promise<UtilizadorRespostaDTO | null> => {
        const utilizador = await utilizadorRepo().findOneBy({ id });
        if (!utilizador) return null;
        if (utilizador.estado === Estado.INATIVO) throw new Error('A conta já está desativada.');

        await utilizadorRepo().update(id, { estado: Estado.INATIVO });
        const atualizado = await utilizadorRepo().findOneBy({ id });
        return atualizado ? toResposta(atualizado) : null;
    },

    // Elimina permanentemente (só para admin — RF07)
    eliminar: async (id: number): Promise<void> => {
        const utilizador = await utilizadorRepo().findOneBy({ id });
        if (!utilizador) throw new Error('Utilizador não encontrado.');
        await utilizadorRepo().delete(id);
    },
};