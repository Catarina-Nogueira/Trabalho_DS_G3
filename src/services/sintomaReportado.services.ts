import { AppDataSource } from '../database/database';
import { Sintoma_Reportado } from '../models/sintomaReportado.entity';
import { Utente } from '../models/utente.entity';
import { CriarSintomaReportadoDTO } from '../dtos/sintomaReportado.dto';

const sintomaReportadoRepo = AppDataSource.getRepository(Sintoma_Reportado);
const utenteRepo = AppDataSource.getRepository(Utente);

export const SintomaReportadoService = {

    // RF55 - Listar todos os sintomas reportados
    listarTodos: async (idExecutor: number, tipoExecutor: string) => {
    const perfil = tipoExecutor.toLowerCase();

    // 1. Se for Administrador, mantém a regra antiga: vê TUDO de toda a gente
    if (perfil === 'administrador') {
        return await sintomaReportadoRepo.find({
            relations: ['utente'],
            order: { data_registo: 'DESC' }
        });
    }

    // 2. Se for Médico, filtra apenas os sintomas dos utentes associados a este médico
    if (perfil === 'medico') {
        return await sintomaReportadoRepo.find({
            where: {
                utente: {
                    medico: { id: idExecutor } // Faz a ligação automática através do relacionamento
                }
            },
            relations: ['utente'],
            order: { data_registo: 'DESC' }
        });
    }

    // 3. Se um Utente ou outro perfil tentar aceder por engano a esta rota geral
    throw new Error('Acesso proibido. O seu perfil não tem permissões para listar todos os registos.');
},

    // RF55 - Listar sintomas reportados de um utente específico (ordenados do mais recente para o mais antigo)
    listarPorUtilizadorSessao: async (id_utilizador_sessao: number) => {
        const utente = await utenteRepo.findOne({ where: { utilizador: { id: id_utilizador_sessao } } });
        if (!utente) throw new Error('Perfil de utente não encontrado.');

        return await sintomaReportadoRepo.find({
            where: { utente: { id: utente.id } },
            order: { data_registo: 'DESC' }
        });
    },

    buscarPorId: async (id: number) => {
        const registo = await sintomaReportadoRepo.findOne({ where: { id }, relations: ['utente'] });
        if (!registo) throw new Error('Registo de sintoma não encontrado.');
        return registo;
    },

    // RF54 - Reporte de sintomas pelo utente
    // Valida que os valores estão entre 0 e 3 (escala de gravidade, tal como o CARAT)
    reportar: async (id_utilizador_sessao: number, dados: CriarSintomaReportadoDTO) => {
        // 1. Encontrar o Utente associado à conta autenticada
        const utente = await utenteRepo.findOne({ where: { utilizador: { id: id_utilizador_sessao } } });
        if (!utente) throw new Error('Apenas utilizadores com perfil de Utente podem reportar sintomas.');

        // 2. Validações personalizadas com base nos teus novos critérios:
        if (dados.nivel_mal_estar_geral < 0 || dados.nivel_mal_estar_geral > 3) 
            throw new Error('O nível de mal-estar geral deve ser entre 0 e 3.');

        if (dados.sintomas_pulmonares < 0 || dados.sintomas_pulmonares > 3) 
            throw new Error('A gravidade dos sintomas pulmonares deve ser entre 0 e 3.');

        if (dados.sintomas_nasais < 0 || dados.sintomas_nasais > 3) 
            throw new Error('A gravidade dos sintomas nasais deve ser entre 0 e 3.');

        if (dados.interrupcao_sono < 0 || dados.interrupcao_sono > 3) 
            throw new Error('O nível de interrupção do sono deve ser entre 0 e 3.');

        if (dados.uso_medicacao_resgate !== 0 && dados.uso_medicacao_resgate !== 1) 
            throw new Error('O uso de medicação de resgate deve ser 0 (Não) ou 1 (Sim).');

        const gatilhosValidos = [0, 2, 3, 4];
        if (!gatilhosValidos.includes(dados.gatilho_identificavel)) 
            throw new Error('O gatilho configurado é inválido. Escolha entre 0 (Nenhum), 2 (Alergéno), 3 (Esforço) ou 4 (Outro).');

        // 3. Guardar o registo diário na BD
        const novoSintoma = sintomaReportadoRepo.create({
            nivel_mal_estar_geral: dados.nivel_mal_estar_geral,
            sintomas_pulmonares: dados.sintomas_pulmonares,
            sintomas_nasais: dados.sintomas_nasais,
            interrupcao_sono: dados.interrupcao_sono,
            uso_medicacao_resgate: dados.uso_medicacao_resgate,
            gatilho_identificavel: dados.gatilho_identificavel,
            notas_adicionais: dados.notas_adicionais?.trim() || null,
            utente: utente
        });

        return await sintomaReportadoRepo.save(novoSintoma);
    },

};