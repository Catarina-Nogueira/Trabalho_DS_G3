import cron from 'node-cron';
import { LembreteService } from './services/lembreteExames.services';

export const inicializarAgendadores = (): void => {
    // Roda diariamente às 08h00 da manhã
    cron.schedule('0 8 * * *', async () => {
        try {
            await LembreteService.verificarEEnviarLembretes();
        } catch (error) {
            console.error('Erro crítico no Cron Job de lembretes:', error);
        }
    }, {
         timezone: "Europe/Lisbon"
    });

    console.log('[Agendador] Monitor de exames ativo no fuso de Portugal.');
};