import { AppDataSource } from '../database/database';
import { Plano_Acompanhamento } from '../models/planoAcompanhamento.entity';

const planoAcompanhamentoRepo = AppDataSource.getRepository(Plano_Acompanhamento);

export const PlanoAcompanhamentoService = {

    // RF49 - Listar todos os planos de acompanhamento
    listarTodos: async () => {
        return await planoAcompanhamentoRepo.find({
            relations: ['medico', 'utente']
        });
    },

    // RF49 - Listar planos de acompanhamento de um utente específico
    listarPorUtente: async (id_utente: number) => {
        return await planoAcompanhamentoRepo.find({
            where: { utente: { id: id_utente } },
            relations: ['medico', 'utente']
        });
    },

    // RF49 - Listar planos de acompanhamento de um médico específico
    listarPorMedico: async (id_medico: number) => {
        return await planoAcompanhamentoRepo.find({
            where: { medico: { id: id_medico } },
            relations: ['medico', 'utente']
        });
    },

    // RF49 - Consultar detalhe de um plano de acompanhamento
    buscarPorId: async (id: number) => {
        return await planoAcompanhamentoRepo.findOne({
            where: { id },
            relations: ['medico', 'utente']
        });
    },

    // RF49 - Criar plano de acompanhamento
    criar: async (dados: Partial<Plano_Acompanhamento>) => {
        const plano = planoAcompanhamentoRepo.create(dados);
        return await planoAcompanhamentoRepo.save(plano);
    },

    // RF49 - Atualizar plano de acompanhamento
    atualizar: async (id: number, dados: Partial<Plano_Acompanhamento>) => {
        await planoAcompanhamentoRepo.update(id, dados);
        return await planoAcompanhamentoRepo.findOne({
            where: { id },
            relations: ['medico', 'utente']
        });
    },

    // RF49 - Eliminar plano de acompanhamento
    eliminar: async (id: number) => {
        return await planoAcompanhamentoRepo.delete(id);
    }

};