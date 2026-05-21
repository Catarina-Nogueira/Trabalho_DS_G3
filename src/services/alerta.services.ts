import { AppDataSource } from '../database/database';
import { Alerta, EstadoAlerta, PrioridadeAlerta, TipoAlerta } from '../models/alerta.entity';
import { AtualizarAlertaDTO} from '../dtos/alerta.dto';

const alertaRepo = AppDataSource.getRepository(Alerta);

// Validação do fluxo de estados
const fluxoValido: Record<EstadoAlerta, EstadoAlerta[]> = {
    [EstadoAlerta.NOVO]: [EstadoAlerta.VISTO],
    [EstadoAlerta.VISTO]: [EstadoAlerta.EM_SEGUIMENTO, EstadoAlerta.FECHADO],
    [EstadoAlerta.EM_SEGUIMENTO]: [EstadoAlerta.FECHADO],
    [EstadoAlerta.FECHADO]: []
};

export const AlertaService = {
    
    // RF36 - Listagem de alertas do médico com filtros
    listarPorMedico: async (id_medico: number, estado?: EstadoAlerta, prioridade?: PrioridadeAlerta) => {
        if (!id_medico || id_medico <= 0) throw new Error('ID do médico inválido');

        const query = alertaRepo.createQueryBuilder('alerta')
            .leftJoinAndSelect('alerta.utente', 'utente')
            .leftJoinAndSelect('alerta.avaliacao', 'avaliacao')
            .leftJoinAndSelect('alerta.sintoma', 'sintoma')
            .where('alerta.medico.id = :id_medico', { id_medico })
            .orderBy('alerta.prioridade', 'DESC')
            .addOrderBy('alerta.data_criacao', 'DESC');

        if (estado) query.andWhere('alerta.estado = :estado', { estado });
        if (prioridade) query.andWhere('alerta.prioridade = :prioridade', { prioridade });

        return await query.getMany();
    },

    // RF38 - Consulta de alertas pelo utente
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
                avaliacao: {
                    id: true, // Adiciona aqui os campos que queres da avaliação
                },
                sintoma: {
                    id: true, // Adiciona aqui os campos que queres do sintoma
                }
            }
        });
    },

    // Buscar alerta por id
    buscarPorId: async (id: number) => {
        if (!id || id <= 0) throw new Error('ID inválido');

        const alerta = await alertaRepo.findOne({
            where: { id },
            relations: ['utente', 'medico', 'avaliacao', 'sintoma']
        });

        if (!alerta) throw new Error('Alerta não encontrado');
        return alerta;
    },

    /*// RF29, RF30, RF31, RF32, RF33 - Gerar alerta automático
    gerarAlerta: async () => {
        

        return await alertaRepo.save(alerta);
    },*/

    // RF33 - Calcular prioridade automaticamente com base no tipo
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

    // RF34 - Atualização do estado do alerta pelo médico
    atualizarEstado: async (id: number, dados: AtualizarAlertaDTO) => {
        if (!id || id <= 0) throw new Error('ID inválido');

        const alerta = await alertaRepo.findOne({
            where: { id },
            relations: ['utente', 'medico']
        });

        if (!alerta) throw new Error('Alerta não encontrado');

        const possiveisEstados = fluxoValido[alerta.estado as EstadoAlerta];

        if (!possiveisEstados || !possiveisEstados.includes(dados.estado)) {
            throw new Error(`Transição inválida: ${alerta.estado} → ${dados.estado}`
        );
    }

    alerta.estado = dados.estado;
    alerta.data_atualizacao = new Date();

     return await alertaRepo.save(alerta);
    
    },

    // Eliminar alerta
    eliminar: async (id: number) => {
        if (!id || id <= 0) throw new Error('ID inválido');

        const alerta = await alertaRepo.findOneBy({ id });
        if (!alerta) throw new Error('Alerta não encontrado');

        await alertaRepo.delete(id);
        return { mensagem: 'Alerta eliminado com sucesso' };
    }
};

