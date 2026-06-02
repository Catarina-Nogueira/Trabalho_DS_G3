import bcrypt from 'bcryptjs';
import { AppDataSource } from '../database/database';
import { Utilizador, Estado, Tipo_Utilizador } from '../models/utilizador.entity';
import { Utente } from '../models/utente.entity';
import { Medico } from '../models/medico.entity';
import { LoginDTO} from '../dtos/autenticacao.dto';

const utilizadorRepo = () => AppDataSource.getRepository(Utilizador);
const utenteRepo     = () => AppDataSource.getRepository(Utente);
const medicoRepo     = () => AppDataSource.getRepository(Medico);

export const AutenticacaoService = {

    // RF01 — Autenticação do utilizador
    login: async (dto: LoginDTO) => {
        // 1. Verificar que o utilizador existe pelo username
        const utilizador = await utilizadorRepo().findOneBy({ username: dto.username });
        if (!utilizador) {
            throw new Error('Username não coincide.');
        }

        // 2. Verificar que a conta está ativa (RF08)
        if (utilizador.estado === Estado.INATIVO) {
            throw new Error('A conta está desativada. Contacte o administrador.');
        }

        // 3. Verificar a password
        const passwordCorreta = await bcrypt.compare(dto.password, utilizador.password);
        if (!passwordCorreta) {
            throw new Error('Password incorreta.');
        }

        // 4. Registar data do último acesso (RF02)
        await utilizadorRepo().update(utilizador.id, {
            data_ultimo_acesso: new Date(),
        });

        // 5. Ir buscar os IDs específicos dependendo do tipo de utilizador
        let id_especifico: number | undefined = undefined;

        if (utilizador.tipo_utilizador === 'utente') {
            const utente = await utenteRepo().findOne({
                where: { utilizador: { id: utilizador.id } },
            });
            if (utente) id_especifico = utente.id;
        } else if (utilizador.tipo_utilizador === 'medico') {
            const medico = await medicoRepo().findOne({
                where: { utilizador: { id: utilizador.id } },
            });
            if (medico) id_especifico = medico.id;
        }
        
        const nome = await AutenticacaoService.obterNomePerfil(utilizador.id, utilizador.tipo_utilizador);

        // Devolve apenas os dados de confirmação do utilizador
        return {
            id_utilizador: utilizador.id,
            tipo_utilizador: utilizador.tipo_utilizador,
            nome,
            id_perfil_especifico: id_especifico // id_utente ou id_medico
        };
    },

    // Obtém o nome do utilizador conforme o seu perfil
    obterNomePerfil: async (id_utilizador: number, tipo: string): Promise<string> => {
        if (tipo === 'utente') {
            const utente = await utenteRepo().findOne({
                where: { utilizador: { id: id_utilizador } },
            });
            return utente?.nome ?? 'Utente';
        }
        if (tipo === 'medico') {
            const medico = await medicoRepo().findOne({
                where: { utilizador: { id: id_utilizador } },
            });
            return medico?.nome ?? 'Médico';
        }
        return 'Administrador';
    },

    // Utilitário — encriptar password antes de guardar (usar no criar utilizador)
    encriptarPassword: async (password: string): Promise<string> => {
        return bcrypt.hash(password, 10);
    },
};