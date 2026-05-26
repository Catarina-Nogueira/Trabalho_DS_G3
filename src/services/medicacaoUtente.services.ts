import { AppDataSource } from '../database/database';
import { AtualizarMedicacaoUtenteDTO, CriarMedicacaoUtenteDTO } from '../dtos/medicacaoUtente.dto';
import { Medicacao_Utente } from '../models/medicacaoUtente.entity';

const medicacaoUtenteRepo = AppDataSource.getRepository(Medicacao_Utente);

export const MedicacaoUtenteService = {

    // RF45 - Listar todas as prescrições de um utente (ativas e históricas)
    listarPorUtente: async (id_utente: number) => {
        return await medicacaoUtenteRepo.find({
            where: { utente: { id: id_utente } },
            relations: ['utente', 'medico', 'medicacao']
        });
    },

    // RF45 - Listar apenas prescrições ativas de um utente
    listarAtivasPorUtente: async (id_utente: number) => {
        return await medicacaoUtenteRepo.find({
            where: { utente: { id: id_utente }, ativo: true },
            relations: ['utente', 'medico', 'medicacao']
        });
    },

    // Listar todas as prescrições feitas por um médico
    listarPorMedico: async (id_medico: number) => {
        return await medicacaoUtenteRepo.find({
            where: { medico: { id: id_medico } },
            relations: ['utente', 'medico', 'medicacao']
        });
    },

    // RF45 - Consultar detalhe de uma prescrição
    buscarPorId: async (id: number) => {
        return await medicacaoUtenteRepo.findOne({
            where: { id },
            relations: ['utente', 'medico', 'medicacao']
        });
    },

   // RF43 - Prescrição de medicação pelo médico
criar: async (dados: CriarMedicacaoUtenteDTO) => {
    const medicacaoUtente = medicacaoUtenteRepo.create({
        utente: { id: dados.utente.id },
        medico: { id: dados.medico.id },
        medicacao: { id: dados.medicacao.id },
        frequencia: dados.frequencia,
        data_inicio: dados.data_inicio,
        duracao: dados.duracao,
        ativo: true
    });
    return await medicacaoUtenteRepo.save(medicacaoUtente);
},

// Atualizar dados da prescrição
atualizar: async (id: number, dados: AtualizarMedicacaoUtenteDTO) => {
    const medicacao = await medicacaoUtenteRepo.findOne({
        where: { id },
        relations: ['utente', 'medico', 'medicacao']
    });

    if (!medicacao) {
        throw new Error('Prescrição não encontrada');
    }

    if (dados.frequencia) {
        medicacao.frequencia = dados.frequencia;
    }
    if (dados.duracao) {
        medicacao.duracao = dados.duracao;
    }

    return await medicacaoUtenteRepo.save(medicacao);
},

    // RF44 - Encerramento de prescrição (marca como inativa, preserva histórico)
    encerrar: async (id: number) => {
        await medicacaoUtenteRepo.update(id, { ativo: false });
        return await medicacaoUtenteRepo.findOne({
            where: { id },
            relations: ['utente', 'medico', 'medicacao']
        });
    }
};