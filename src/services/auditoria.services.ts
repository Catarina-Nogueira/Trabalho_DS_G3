import { AppDataSource } from '../database/database';
import { Auditoria, EntidadeAuditoria, AcaoAuditoria } from '../models/auditoria.entity';
import { Utilizador } from '../models/utilizador.entity';
import { CriarAuditoriaDTO, AuditoriaRespostaDTO } from '../dtos/auditoria.dto';

const auditoriaRepo = AppDataSource.getRepository(Auditoria);
const utilizadorRepo = AppDataSource.getRepository(Utilizador);

export const AuditoriaService = {

    // O "Coração" do módulo: Chamado internamente sempre que uma ação corre bem
    registar: async (dados: CriarAuditoriaDTO): Promise<void> => {
        try {
            // Criamos a referência usando o ID do utilizador sem precisar de fazer um SELECT pesado antes
            const novoLog = auditoriaRepo.create({
                entidade_afetada: dados.entidade_afetada,
                acao: dados.acao,
                utilizador: { id: dados.id_utilizador } as Utilizador 
            });

            await auditoriaRepo.save(novoLog);
        } catch (error: any) {
            // Em auditoria, se o log falhar, fazemos catch para não deitar abaixo a operação principal do utente
            console.error('Falha crítica ao gravar log de auditoria:', error.message);
        }
    },

    // Consulta exclusiva para os Administradores
    listarTodosOsLogs: async (): Promise<AuditoriaRespostaDTO[]> => {
        const logs = await auditoriaRepo.find({
            relations: ['utilizador'],
            order: { data: 'DESC' } // O mais recente primeiro
        });

        return logs.map(log => ({
            id: log.id,
            data: log.data.toISOString(),
            entidade_afetada: log.entidade_afetada,
            acao: log.acao,
            utilizador: {
                id: log.utilizador?.id,
                email: log.utilizador?.email || 'N/A',
                tipo: log.utilizador?.tipo_utilizador || 'Desconhecido'
            }
        }));
    }
};