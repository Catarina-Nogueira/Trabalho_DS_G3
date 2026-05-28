import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../database/database';
import { Utilizador, Estado, Tipo_Utilizador } from '../models/utilizador.entity';
import { Utente } from '../models/utente.entity';
import { Medico } from '../models/medico.entity';
import { LoginDTO, TokenPayload } from '../dtos/autenticacao.dto';

const utilizadorRepo = () => AppDataSource.getRepository(Utilizador);
const utenteRepo     = () => AppDataSource.getRepository(Utente);
const medicoRepo     = () => AppDataSource.getRepository(Medico);

// Chave secreta para assinar o token — em produção deve estar numa variável de ambiente
const JWT_SECRET  = process.env.JWT_SECRET || 'saudinob_secret_key';
// Token expira em 10 min
const JWT_EXPIRES = '10min';

export const AutenticacaoService = {

    // RF01 — Autenticação do utilizador
    login: async (dto: LoginDTO) => {
        // 1. Verificar que o utilizador existe pelo username
        const utilizador = await utilizadorRepo().findOneBy({ username: dto.username });
        if (!utilizador) {
            throw new Error('Dados não coincidem.');
        }

        // 2. Verificar que a conta está ativa (RF08)
        if (utilizador.estado === Estado.INATIVO) {
            throw new Error('A conta está desativada. Contacte o administrador.');
        }

        // 3. Verificar a password
        const passwordCorreta = await bcrypt.compare(dto.password, utilizador.password);
        if (!passwordCorreta) {
            throw new Error('Dados não coincidem.');
        }

        // 4. Construir o payload do token conforme o perfil
        const payload: TokenPayload = {
            id_utilizador: utilizador.id,
            tipo_utilizador: utilizador.tipo_utilizador as Tipo_Utilizador,
        };

        // Se for utente, incluir o id_utente no token
        if (utilizador.tipo_utilizador === 'utente') {
            const utente = await utenteRepo().findOne({
                where: { utilizador: { id: utilizador.id } },
            });
            if (utente) payload.id_utente = utente.id;
        }

        // Se for médico, incluir o id_medico no token
        if (utilizador.tipo_utilizador === 'medico') {
            const medico = await medicoRepo().findOne({
                where: { utilizador: { id: utilizador.id } },
            });
            if (medico) payload.id_medico = medico.id;
        }

        // 5. Gerar o token (RF25 — token com tempo de expiração)
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

        // 6. Registar data do último acesso (RF02)
        await utilizadorRepo().update(utilizador.id, {
            data_ultimo_acesso: new Date(),
        });

        // 7. Devolver token e informação básica do perfil
        const nome = await AutenticacaoService.obterNomePerfil(utilizador.id, utilizador.tipo_utilizador);

        return {
            token,
            tipo_utilizador: utilizador.tipo_utilizador,
            nome,
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

    // RF03 — Logout (o token é invalidado no cliente; aqui apenas confirmamos)
    logout: async () => {
        // Com JWT simples o logout é feito no cliente apagando o token.
        // Se quiseres invalidação no servidor precisarias de uma blacklist.
        return { mensagem: 'Sessão terminada com sucesso.' };
    },
};