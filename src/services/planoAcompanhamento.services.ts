import { AppDataSource } from '../database/database';
import { Plano_Acompanhamento } from '../models/planoAcompanhamento.entity';
import { CriarPlanoDTO, AtualizarPlanoDTO } from '../dtos/planoAcompanhamento.dto';

const planoRepo = AppDataSource.getRepository(Plano_Acompanhamento);

export const PlanoAcompanhamentoService = {

    // Listar todos os planos de um utente
    listarPorUtente: async (id_utente: number) => {
        return await planoRepo.find({
            where: { utente: { id: id_utente } },
            relations: ['medico', 'utente']
        });
    },

    // Listar todos os planos prescritos por um médico
    listarPorMedico: async (id_medico: number) => {
        return await planoRepo.find({
            where: { medico: { id: id_medico } },
            relations: ['medico', 'utente']
        });
    },

    
    // Criar plano de acompanhamento
    criar: async (id_medico: number, id_utente: number, dados: CriarPlanoDTO) => {
        const plano = planoRepo.create({
            descricao: dados.descricao,
            data_inicio: dados.data_inicio,
            data_fim: dados.data_fim,
            medico: { id: id_medico },
            utente: { id: id_utente }
        });
        
        const guardado = await planoRepo.save(plano);
        
        return await planoRepo.findOne({
            where: { id: guardado.id },
            relations: ['medico', 'utente']
        });
    },

    // RF49 - Atualizar plano de acompanhamento
    atualizar: async (id: number, dados: AtualizarPlanoDTO) => {
        const existe = await planoRepo.findOneBy({ id });
        if (!existe) return null;
        
        await planoRepo.update(id, dados);
        return await planoRepo.findOne({ where: { id }, relations: ['medico', 'utente'] });
    },

    // RF49 - Eliminar plano de acompanhamento
    eliminar: async (id: number) => {
        const existe = await planoRepo.findOneBy({ id });
        if (!existe) throw new Error('Plano de acompanhamento não encontrado.');
        await planoRepo.delete(id);
    }

};