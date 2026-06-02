import { AppDataSource } from '../database/database';
import { Exame_Utente } from '../models/exameUtente.entity';
import { Between } from 'typeorm';
import { LembreteExameRespostaDTO } from '../dtos/lembreteExames.dto';

const exameUtenteRepo = AppDataSource.getRepository(Exame_Utente);

// Função auxiliar para calcular o intervalo de 24h (Amanhã)
const obterIntervaloLembrete = () => {
    const amanhaInicio = new Date();
    amanhaInicio.setDate(amanhaInicio.getDate() + 1);
    amanhaInicio.setHours(0, 0, 0, 0);

    const amanhaFim = new Date();
    amanhaFim.setDate(amanhaFim.getDate() + 1);
    amanhaFim.setHours(23, 59, 59, 999);

    return { amanhaInicio, amanhaFim };
};

const toLembreteDTO = (registo: Exame_Utente): LembreteExameRespostaDTO => ({
    exame_utente_id: registo.id,
    data_exame: registo.data_exame.toLocaleDateString('pt-PT'),
    hora_exame: registo.data_exame.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
    utente: {
        id: registo.utente?.id,
        nome: registo.utente?.nome,
        email: registo.utente?.utilizador?.email || 'Sem e-mail'
    },
    medico: {
        id: registo.medico?.id,
        nome: registo.medico?.nome
    },
    exame: {
        id: registo.exame?.id,
        nome_exame: registo.exame?.nome_exame, 
        tipo: registo.exame?.tipo
    }
});

export const LembreteService = {

    // 1. Método acionado automaticamente pelo CRON JOB
    verificarEEnviarLembretes: async (): Promise<void> => {
        console.log('[Cron] A iniciar verificação de exames próximos...');
        const { amanhaInicio, amanhaFim } = obterIntervaloLembrete();

        try {
            const examesAgendados = await exameUtenteRepo.find({
                where: { data_exame: Between(amanhaInicio, amanhaFim) },
                relations: ['utente', 'utente.utilizador', 'medico', 'exame']
            });

            if (examesAgendados.length === 0) {
                console.log('[Cron] Nenhum exame agendado para as próximas 24 horas.');
                return;
            }

            for (const registo of examesAgendados) {
                const dto = toLembreteDTO(registo);
                
                if (dto.utente.email === 'Sem e-mail') continue;

                // Simulação do envio de e-mail/notificação push
                console.log(`==================================================================`);
                console.log(`✉️ LEMBRETE DISPARADO PARA: ${dto.utente.nome} (<${dto.utente.email}>)`);
                console.log(`Procedimento: ${dto.exame.nome_exame} (${dto.exame.tipo})`);
                console.log(`Horário: Amanhã às ${dto.hora_exame} | Médico Responsável: ${dto.medico.nome}`);
                console.log(`==================================================================`);
            }
        } catch (error: any) {
            console.error(' Erro ao ler exames agendados do cron:', error.message);
        }
    },

    // 2. Método para o Painel Administrativo / Médico consultar via API
    listarLembretesDoDiaSeguinte: async (): Promise<LembreteExameRespostaDTO[]> => {
        const { amanhaInicio, amanhaFim } = obterIntervaloLembrete();
        
        const exames = await exameUtenteRepo.find({
            where: { data_exame: Between(amanhaInicio, amanhaFim) },
            relations: ['utente', 'utente.utilizador', 'medico', 'exame']
        });

        return exames.map(toLembreteDTO);
    }
};