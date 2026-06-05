import { AppDataSource } from '../database/database';
import { Utente } from '../models/utente.entity';
import { Medico } from '../models/medico.entity';
import { Utilizador } from '../models/utilizador.entity';
import { CriarUtenteDTO, AtualizarUtenteDTO, UtenteRespostaDTO } from '../dtos/utente.dto';
import { AuditoriaService } from './auditoria.services';
import { EntidadeAuditoria, AcaoAuditoria } from '../models/auditoria.entity';

const utenteRepo  = () => AppDataSource.getRepository(Utente);
const medicoRepo  = () => AppDataSource.getRepository(Medico);
const utilizadorRepo = () => AppDataSource.getRepository(Utilizador);

const calcularIdade = (data_nascimento: string): number => {
    const hoje = new Date();
    const nascimento = new Date(data_nascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const aindaNaoFezAnos =
        hoje.getMonth() < nascimento.getMonth() ||
        (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
    if (aindaNaoFezAnos) idade--;
    return idade;
};

const toResposta = (u: Utente): UtenteRespostaDTO => ({
    id: u.id,
    nome: u.nome,
    data_nascimento: u.data_nascimento,
    idade: calcularIdade(u.data_nascimento),
    sexo_biologico: u.sexo_biologico as any,
    utilizador: {
        id: u.utilizador.id,
        username: u.utilizador.username,
        email: u.utilizador.email,
        estado: u.utilizador.estado,
        tipo_utilizador: u.utilizador.tipo_utilizador
    },
    medico: {
        id: u.medico.id,
        nome: u.medico.nome,
        especialidade: u.medico.especialidade,
    },
    data_atualizacao: u.utilizador.data_ultimo_acesso,
});

export const UtenteService = {

    listarTodos: async (): Promise<UtenteRespostaDTO[]> => {
        const utentes = await utenteRepo().find({
            relations: ['medico', 'utilizador'],
        });
        return utentes.map(toResposta);
    },

    listarPorMedico: async (id_medico: number): Promise<UtenteRespostaDTO[]> => {
        const utentes = await utenteRepo().find({
            where: { medico: { id: id_medico } },
            relations: ['medico', 'utilizador'],
        });
        return utentes.map(toResposta);
    },

    buscarPorId: async (id: number): Promise<UtenteRespostaDTO | null> => {
        const utente = await utenteRepo().findOne({
            where: { id },
            relations: ['medico', 'utilizador'],
        });
        if (!utente) return null;
        return toResposta(utente);
    },

    buscarDadosPermitidos: async (id: number) => {
        const utente = await utenteRepo().findOne({
            where: { id },
            relations: ['medico', 'utilizador']
        });
        if (!utente) return null;
        return utente;
    },

    criar: async (dados: CriarUtenteDTO, id_utilizador: number, id_medico: number, idUtilizadorLogado: number): Promise<UtenteRespostaDTO> => {
        if (!id_utilizador || id_utilizador <= 0) throw new Error('ID de utilizador inválido ou não fornecido.');
        if (!id_medico || id_medico <= 0) throw new Error('ID de médico inválido ou não fornecido.');

        const utilizador = await utilizadorRepo().findOneBy({ id: id_utilizador });
        if (!utilizador) throw new Error('Utilizador não encontrado.');

        const jaExiste = await utenteRepo().findOne({ where: { utilizador: { id: id_utilizador } } });
        if (jaExiste) throw new Error('Este utilizador já tem um utente associado.');

        const medico = await medicoRepo().findOneBy({ id: id_medico });
        if (!medico) throw new Error('Médico não encontrado.');

        const utente = utenteRepo().create({
            nome: dados.nome.trim(),
            data_nascimento: dados.data_nascimento,
            sexo_biologico: dados.sexo_biologico.toLowerCase(),
            utilizador,
            medico,
        });

        const guardado = await utenteRepo().save(utente);

        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: EntidadeAuditoria.UTENTE,
            acao: AcaoAuditoria.CRIAR
        });

        const completo = await utenteRepo().findOne({
            where: { id: guardado.id },
            relations: ['medico', 'utilizador'],
        });
        return toResposta(completo!);
    },

    atualizar: async (id: number, dados: AtualizarUtenteDTO, utilizadorSession: {id: number, tipo_utilizador: string}): Promise<UtenteRespostaDTO | null> => {
        const utente = await utenteRepo().findOne({
            where: { id },
            relations: ['medico', 'utilizador'],
        });
        if (!utente) return null;

        if (dados.nome) {
            if (utilizadorSession.id !== utente.utilizador.id && utilizadorSession.tipo_utilizador.toLowerCase() !== 'administrador') {
                throw new Error('Apenas o próprio utente ou um administrador podem atualizar o nome.');
            } 
            utente.nome = dados.nome.trim();
        } 

        if (dados.medico) {
            if (utilizadorSession.tipo_utilizador.toLowerCase() !== 'administrador') {
                throw new Error('Apenas um administrador pode atualizar o médico atribuído.');
            }
            const medico = await medicoRepo().findOneBy({ id: dados.medico.id });
            if (!medico) throw new Error('Médico não encontrado.');
            utente.medico = medico;
        }

        const atualizado = await utenteRepo().save(utente);

        
        await AuditoriaService.registar({
            id_utilizador: utilizadorSession.id,
            entidade_afetada: EntidadeAuditoria.UTENTE,
            acao: AcaoAuditoria.ATUALIZAR
        });

        return toResposta(atualizado);
    },

    eliminar: async (id: number, idUtilizadorLogado: number): Promise<void> => {
        const utente = await utenteRepo().findOneBy({ id });
        if (!utente) throw new Error('Utente não encontrado.');
        
        await utenteRepo().remove(utente);

       
        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: EntidadeAuditoria.UTENTE,
            acao: AcaoAuditoria.ELIMINAR
        });
    },
};