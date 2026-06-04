import { AppDataSource } from '../database/database';
import { AtualizarMedicacaoUtenteDTO, CriarMedicacaoUtenteDTO } from '../dtos/medicacaoUtente.dto';
import { Medicacao_Utente } from '../models/medicacaoUtente.entity';
import { AuditoriaService } from './auditoria.services';
import { EntidadeAuditoria, AcaoAuditoria } from '../models/auditoria.entity';

const medicacaoUtenteRepo = AppDataSource.getRepository(Medicacao_Utente);

export const MedicacaoUtenteService = {

    listarPorUtente: async (id_utente: number) => {
        return await medicacaoUtenteRepo.find({
            where: { utente: { id: id_utente } },
            relations: ['utente', 'medico', 'medicacao'],
            order: { data_inicio: 'DESC' }
        });
    },

    listarAtivasPorUtente: async (id_utente: number) => {
        return await medicacaoUtenteRepo.find({
            where: { utente: { id: id_utente }, ativo: true },
            relations: ['utente', 'medico', 'medicacao'],
            order: { data_inicio: 'DESC' }
        });
    },

    listarPorMedico: async (id_medico: number) => {
        return await medicacaoUtenteRepo.find({
            where: { medico: { id: id_medico } },
            relations: ['utente', 'medico', 'medicacao']
        });
    },

    buscarPorId: async (id: number) => {
        return await medicacaoUtenteRepo.findOne({
            where: { id },
            relations: ['utente', 'medico', 'medicacao']
        });
    },

    criar: async (dados: CriarMedicacaoUtenteDTO, idUtilizadorLogado: number) => {
        const medicacaoUtente = medicacaoUtenteRepo.create({
            utente: { id: dados.utente.id },
            medico: { id: dados.medico.id },
            medicacao: { id: dados.medicacao.id },
            frequencia: dados.frequencia.trim(),
            data_inicio: dados.data_inicio,
            duracao: dados.duracao.trim(),
            dosagem: dados.dosagem.trim(),
            ativo: true
        });

        const resultado = await medicacaoUtenteRepo.save(medicacaoUtente);

        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: 'MEDICACAO_UTENTE' as EntidadeAuditoria,
            acao: 'CRIAR' as AcaoAuditoria
        });

        return resultado;
    },

    atualizar: async (id: number, dados: AtualizarMedicacaoUtenteDTO, idUtilizadorLogado: number) => {
        const medicacao = await medicacaoUtenteRepo.findOne({ where: { id } });

        if (!medicacao) throw new Error('Prescrição não encontrada');

        if (dados.frequencia) medicacao.frequencia = dados.frequencia.trim();
        if (dados.duracao) medicacao.duracao = dados.duracao.trim();
        if (dados.dosagem) medicacao.dosagem = dados.dosagem.trim();

        const resultado = await medicacaoUtenteRepo.save(medicacao);

        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: 'MEDICACAO_UTENTE' as EntidadeAuditoria,
            acao: 'ATUALIZAR' as AcaoAuditoria
        });

        return resultado;
    },

    encerrar: async (id: number, idUtilizadorLogado: number) => {
        const medicacao = await medicacaoUtenteRepo.findOne({ where: { id } });

        if (!medicacao) throw new Error('Prescrição não encontrada');

        medicacao.ativo = false;
        const resultado = await medicacaoUtenteRepo.save(medicacao);

        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: 'MEDICACAO_UTENTE' as EntidadeAuditoria,
            acao: 'ATUALIZAR' as AcaoAuditoria
        });

        return resultado;
    }
};