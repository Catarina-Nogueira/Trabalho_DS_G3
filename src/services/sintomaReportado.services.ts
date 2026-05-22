import { AppDataSource } from '../database/database';
import { Sintoma_Reportado } from '../models/sintomaReportado.entity';

const sintomaReportadoRepo = AppDataSource.getRepository(Sintoma_Reportado);

export const SintomaReportadoService = {

    // RF55 - Listar todos os sintomas reportados
    listarTodos: async () => {
        return await sintomaReportadoRepo.find({
            relations: ['utente']
        });
    },

    // RF55 - Listar sintomas reportados de um utente específico (ordenados do mais recente para o mais antigo)
    listarPorUtente: async (id_utente: number) => {
        return await sintomaReportadoRepo.find({
            where: { utente: { id: id_utente } },
            relations: ['utente'],
            order: { data_registo: 'DESC' }
        });
    },

    // Consultar detalhe de um sintoma reportado
    buscarPorId: async (id: number) => {
        return await sintomaReportadoRepo.findOne({
            where: { id },
            relations: ['utente']
        });
    },

    // RF54 - Reporte de sintomas pelo utente
    // Valida que os valores estão entre 0 e 3 (escala de gravidade, tal como o CARAT)
    reportar: async (id_utente: number, dados: Partial<Sintoma_Reportado>) => {
        const campos = [
            'nivel_mal_estar_geral',
            'sintomas_pulmonares',
            'sintomas_nasais',
            'interrupcao_sono',
            'uso_medicacao_resgate',
            'gatilho_identificavel'
        ];

        // Valida que todos os campos numéricos estão entre 0 e 3
        for (const campo of campos) {
            const valor = (dados as any)[campo];
            if (valor === undefined || valor === null) {
                throw new Error(`Campo ${campo} é obrigatório`);
            }
            if (valor < 0 || valor > 3) {
                throw new Error(`Campo ${campo} deve estar entre 0 e 3`);
            }
        }

        const sintoma = sintomaReportadoRepo.create({
            ...dados,
            utente: { id: id_utente }
        });

        return await sintomaReportadoRepo.save(sintoma);
    },

    // Atualizar sintoma reportado
    atualizar: async (id: number, dados: Partial<Sintoma_Reportado>) => {
        await sintomaReportadoRepo.update(id, dados);
        return await sintomaReportadoRepo.findOne({
            where: { id },
            relations: ['utente']
        });
    },

    // Eliminar sintoma reportado
    eliminar: async (id: number) => {
        return await sintomaReportadoRepo.delete(id);
    }

};