import { AppDataSource } from '../database/database';
import { Utente } from '../models/utente.entity';
import { Medico } from '../models/medico.entity';
import { Utilizador } from '../models/utilizador.entity';
import { CriarUtenteDTO, AtualizarUtenteDTO, UtenteRespostaDTO } from '../dtos/utente.dto';

const utenteRepo  = () => AppDataSource.getRepository(Utente);
const medicoRepo  = () => AppDataSource.getRepository(Medico);
const utilizadorRepo = () => AppDataSource.getRepository(Utilizador);

// Converte entidade para DTO de resposta
const toResposta = (u: Utente): UtenteRespostaDTO => ({
    id: u.id,
    nome: u.nome,
    data_nascimento: u.data_nascimento,
    sexo_biologico: u.sexo_biologico as any,
    utilizador: {
        id: u.utilizador.id,
        email: u.utilizador.email,
    },
    medico: {
        id: u.medico.id,
        nome: u.medico.nome,
        especialidade: u.medico.especialidade,
    },
    data_atualizacao: u.utilizador.data_ultimo_acesso,
});

export const UtenteService = {

    // RF51 — Listagem de todos os utentes (Administrador)
    listarTodos: async (): Promise<UtenteRespostaDTO[]> => {
        const utentes = await utenteRepo().find({
            relations: ['medico', 'utilizador'],
        });
        return utentes.map(toResposta);
    },

    // RF51 — Listar utentes de um médico específico
    listarPorMedico: async (id_medico: number): Promise<UtenteRespostaDTO[]> => {
        const utentes = await utenteRepo().find({
            where: { medico: { id: id_medico } },
            relations: ['medico', 'utilizador'],
        });
        return utentes.map(toResposta);
    },

    // RF50 — Consulta de detalhe completo do utente (médico/admin)
    buscarPorId: async (id: number): Promise<UtenteRespostaDTO | null> => {
        const utente = await utenteRepo().findOne({
            where: { id },
            relations: ['medico', 'utilizador'],
        });
        if (!utente) return null;
        return toResposta(utente);
    },

    // RF50 — Apenas os dados clínicos permitidos (sem dados administrativos — RF06)
    buscarDadosPermitidos: async (id: number) => {
        const utente = await utenteRepo().findOne({
            where: { id },
            select: {
                id: true,
                nome: true,
                data_nascimento: true,
                sexo_biologico: true,
            },
        });
        if (!utente) return null;
        return utente;
    },

    // RF07 — Criar utente (Administrador)
    // Recebe id_utilizador e id_medico porque o utente já tem um Utilizador criado antes
    criar: async (dados: CriarUtenteDTO, id_utilizador: number, id_medico: number): Promise<UtenteRespostaDTO> => {
        // Verificar que o utilizador existe e ainda não tem utente associado
        const utilizador = await utilizadorRepo().findOneBy({ id: id_utilizador });
        if (!utilizador) throw new Error('Utilizador não encontrado.');

        const jaExiste = await utenteRepo().findOne({ where: { utilizador: { id: id_utilizador } } });
        if (jaExiste) throw new Error('Este utilizador já tem um utente associado.');

        // Verificar que o médico existe
        const medico = await medicoRepo().findOneBy({ id: id_medico });
        if (!medico) throw new Error('Médico não encontrado.');

        const utente = utenteRepo().create({
            nome: dados.nome,
            data_nascimento: dados.data_nascimento,
            sexo_biologico: dados.sexo_biologico,
            utilizador,
            medico,
        });

        const guardado = await utenteRepo().save(utente);

        // Recarregar com relações para devolver resposta completa
        const completo = await utenteRepo().findOne({
            where: { id: guardado.id },
            relations: ['medico', 'utilizador'],
        });
        return toResposta(completo!);
    },

    // RF05 — Atualizar dados pessoais permitidos (nome e/ou médico atribuído)
    atualizar: async (id: number, dados: AtualizarUtenteDTO): Promise<UtenteRespostaDTO | null> => {
        const utente = await utenteRepo().findOne({
            where: { id },
            relations: ['medico', 'utilizador'],
        });
        if (!utente) return null;

        // Atualizar nome se fornecido
        if (dados.nome) utente.nome = dados.nome;

        // Atualizar médico se fornecido — verificar que existe
        if (dados.medico) {
            const medico = await medicoRepo().findOneBy({ id: dados.medico.id });
            if (!medico) throw new Error('Médico não encontrado.');
            utente.medico = medico;
        }

        const atualizado = await utenteRepo().save(utente);
        return toResposta(atualizado);
    },

    // RF08 — Eliminar utente (Administrador)
    eliminar: async (id: number): Promise<void> => {
        const utente = await utenteRepo().findOneBy({ id });
        if (!utente) throw new Error('Utente não encontrado.');
        await utenteRepo().delete(id);
    },
};
