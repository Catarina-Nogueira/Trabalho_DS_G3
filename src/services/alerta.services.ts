import { AppDataSource } from '../database/database';
import { Alerta, EstadoAlerta, PrioridadeAlerta, TipoAlerta } from '../models/alerta.entity';
import { AtualizarAlertaDTO } from '../dtos/alerta.dto';
import { AuditoriaService } from './auditoria.services';
import { EntidadeAuditoria, AcaoAuditoria } from '../models/auditoria.entity';

const alertaRepo = AppDataSource.getRepository(Alerta);

const fluxoValido: Record<EstadoAlerta, EstadoAlerta[]> = {
    [EstadoAlerta.NOVO]: [EstadoAlerta.VISTO],
    [EstadoAlerta.VISTO]: [EstadoAlerta.EM_SEGUIMENTO, EstadoAlerta.FECHADO],
    [EstadoAlerta.EM_SEGUIMENTO]: [EstadoAlerta.FECHADO],
    [EstadoAlerta.FECHADO]: []
};

export const AlertaService = {
    
    // RF36 - Listagem de alertas do médico com filtros via QueryBuilder
    listarPorMedico: async (id_medico: number, estado?: EstadoAlerta, prioridade?: PrioridadeAlerta, id_utente?: number) => {
        if (!id_medico || id_medico <= 0) throw new Error('ID do médico inválido');

        const query = alertaRepo.createQueryBuilder('alerta')
            .leftJoinAndSelect('alerta.medico', 'medico')
            .leftJoinAndSelect('alerta.utente', 'utente')
            .leftJoinAndSelect('alerta.avaliacao', 'avaliacao')
            .leftJoinAndSelect('alerta.sintoma', 'sintoma')
            .where('alerta.medico.id = :id_medico', { id_medico });

        if (estado) query.andWhere('alerta.estado = :estado', { estado });
        if (prioridade) query.andWhere('alerta.prioridade = :prioridade', { prioridade });
        if (id_utente && id_utente > 0) query.andWhere('alerta.utente.id = :id_utente', { id_utente });

        // Ordenação por Peso de Prioridade (ALTA -> MEDIA -> BAIXA) e data de registo
        query.orderBy(`CASE alerta.prioridade 
                        WHEN '${PrioridadeAlerta.ALTA}' THEN 1 
                        WHEN '${PrioridadeAlerta.MEDIA}' THEN 2 
                        WHEN '${PrioridadeAlerta.BAIXA}' THEN 3 
                       END`, 'ASC')
             .addOrderBy('alerta.data_criacao', 'DESC');

        return await query.getMany();
    },

    // RF38 - Consulta de alertas simplificada pelo utente
    listarPorUtente: async (id_utente: number) => {
        if (!id_utente || id_utente <= 0) throw new Error('ID do utente inválido');

        return await alertaRepo.find({
            where: { utente: { id: id_utente } },
            relations: ['avaliacao', 'sintoma'],
            order: { data_criacao: 'DESC' },
            select: {
                id: true,
                tipo: true,
                prioridade: true,
                estado: true,
                motivo: true,
                data_criacao: true,
                avaliacao: { id: true },
                sintoma: { id: true }
            }
        });
    },

    // Procura atómica por ID (Relações limpas e diretas à raiz)
    buscarPorId: async (id: number) => {
        if (!id || id <= 0) throw new Error('ID inválido');

        const alerta = await alertaRepo.findOne({
            where: { id },
            relations: ['utente', 'medico', 'avaliacao', 'sintoma']
        });

        if (!alerta) throw new Error('Alerta não encontrado');
        return alerta;
    },

    // RF29 a RF33 - Gerar alerta automático integrado com módulos do sistema
    gerarAlertaAutomatico: async (
        id_utente: number,
        id_medico: number,
        tipo: TipoAlerta,
        motivo: string,
        id_avaliacao: number | null = null,
        id_sintoma: number | null = null
    ) => {
        const prioridade = AlertaService.calcularPrioridade(tipo);

        const novoAlerta = alertaRepo.create({
            utente: { id: id_utente },
            medico: { id: id_medico },
            avaliacao: id_avaliacao ? { id: id_avaliacao } : null,
            sintoma: id_sintoma ? { id: id_sintoma } : null,
            tipo,
            prioridade,
            motivo,
            estado: EstadoAlerta.NOVO
        });

        return await alertaRepo.save(novoAlerta);
    },

    // RF33 - Determinação automática da severidade do gatilho clínico
    calcularPrioridade: (tipo: TipoAlerta): PrioridadeAlerta => {
        switch (tipo) {
            case TipoAlerta.SCORE_CARAT:
            case TipoAlerta.SINTOMA_GRAVE:
                return PrioridadeAlerta.ALTA;
            case TipoAlerta.MEDICACAO:
            case TipoAlerta.EXAME_PENDENTE:
                return PrioridadeAlerta.MEDIA;
            default:
                return PrioridadeAlerta.BAIXA;
        }
    },

    // RF34 - Máquina de Estados Finita e Controlada para Transição Clínica
    atualizarEstado: async (id: number, dados: AtualizarAlertaDTO, idUtilizadorLogado: number) => {
        if (!id || id <= 0) throw new Error('ID inválido');

        const alerta = await alertaRepo.findOne({
            where: { id },
            relations: ['utente', 'medico']
        });

        if (!alerta) throw new Error('Alerta não encontrado');

        const possiveisEstados = fluxoValido[alerta.estado as EstadoAlerta];

        if (!possiveisEstados || !possiveisEstados.includes(dados.estado)) {
            throw new Error(`Transição de estado inválida para o fluxo clínico: ${alerta.estado} → ${dados.estado}`);
        }

        alerta.estado = dados.estado;

        const atualizado = await alertaRepo.save(alerta);

        await AuditoriaService.registar({
            id_utilizador: idUtilizadorLogado,
            entidade_afetada: EntidadeAuditoria.ALERTA,
            acao: AcaoAuditoria.ATUALIZAR
        });

        return atualizado;
    },

    // Eliminar alerta física do sistema
    eliminar: async (id: number) => {
        if (!id || id <= 0) throw new Error('ID inválido');

        const alerta = await alertaRepo.findOneBy({ id });
        if (!alerta) throw new Error('Alerta não encontrado');

        await alertaRepo.delete(id);
        return { mensagem: 'Alerta eliminado com sucesso' };
    }
};