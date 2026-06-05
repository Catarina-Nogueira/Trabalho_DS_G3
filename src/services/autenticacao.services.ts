import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../database/database';
import { Utilizador, Estado, Tipo_Utilizador } from '../models/utilizador.entity';
import { Utente } from '../models/utente.entity';
import { Medico } from '../models/medico.entity';
import { LoginDTO, LoginRespostaDTO } from '../dtos/autenticacao.dto';
import { Administrador } from '../models/administrador.entity';

const utilizadorRepo = () => AppDataSource.getRepository(Utilizador);
const utenteRepo     = () => AppDataSource.getRepository(Utente);
const medicoRepo     = () => AppDataSource.getRepository(Medico);
const administradorRepo = () => AppDataSource.getRepository(Administrador);



// Chave secreta para assinar o token (Num ambiente real, usar process.env.JWT_SECRET)
const JWT_SECRET = 'chave_segura';

export const AutenticacaoService = {

    login: async (dto: LoginDTO): Promise<LoginRespostaDTO> => {
        // 1. Verificar que o utilizador existe pelo username
        const utilizador = await utilizadorRepo().findOneBy({ username: dto.username });
        if (!utilizador) {
            throw new Error('Credenciais inválidas.'); // Mensagem genérica por segurança
        }

        // 2. Verificar se a conta está ativa
        if (utilizador.estado === Estado.INATIVO) {
            throw new Error('A conta está desativada. Contacte o administrador.');
        }

        // 3. Verificar a password
        const passwordCorreta = await bcrypt.compare(dto.password, utilizador.password);
        if (!passwordCorreta) {
            throw new Error('Credenciais inválidas.');
        }

        // 4. Registar data do último acesso
        await utilizadorRepo().update(utilizador.id, {
            data_ultimo_acesso: new Date(),
        });

        // 5. Obter ID do perfil específico
        let id_especifico: number | undefined = undefined;

        if (utilizador.tipo_utilizador === Tipo_Utilizador.UTENTE) {
            const utente = await utenteRepo().findOne({
                where: { utilizador: { id: utilizador.id } },
            });
            if (utente) id_especifico = utente.id;
        } else if (utilizador.tipo_utilizador === Tipo_Utilizador.MEDICO) {
            const medico = await medicoRepo().findOne({
                where: { utilizador: { id: utilizador.id } },
            });
            if (medico) id_especifico = medico.id;
        }
        
        const nome = await AutenticacaoService.obterNomePerfil(utilizador.id, utilizador.tipo_utilizador);

        // 6. Gerar Token JWT com as credenciais encriptadas
        const payload = {
            id_utilizador: utilizador.id,
            tipo_utilizador: utilizador.tipo_utilizador as Tipo_Utilizador,
            id_perfil_especifico: id_especifico
        };

        const token = jwt.sign(payload, JWT_SECRET!, { expiresIn: '8h' });

        return {
            token,
            tipo_utilizador: utilizador.tipo_utilizador ,
            nome,
            id_perfil_especifico: id_especifico
            
        };
    },

    obterNomePerfil: async (id_utilizador: number, tipo: Tipo_Utilizador): Promise<string> => {

        if (tipo === Tipo_Utilizador.UTENTE) {
            const utente = await utenteRepo().findOne({
                where: { utilizador: { id: id_utilizador } }
            });
            return utente?.nome ?? 'Utente';
        }

        if (tipo === Tipo_Utilizador.MEDICO) {
            const medico = await medicoRepo().findOne({
                where: { utilizador: { id: id_utilizador } }
            });
            return medico?.nome ?? 'Médico';
        }

        if (tipo === Tipo_Utilizador.ADMINISTRADOR) {
            const administrador = await administradorRepo().findOne({
                where: { utilizador: { id: id_utilizador } }
            });

            return administrador?.nome ?? 'Administrador';
        }

        return 'Utilizador';
    },

    encriptarPassword: async (password: string): Promise<string> => {
        return bcrypt.hash(password, 10);
    },
};