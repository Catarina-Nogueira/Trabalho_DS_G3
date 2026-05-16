import { AppDataSource } from '../database/database';
import { Alerta, EstadoAlerta, PrioridadeAlerta, TipoAlerta } from '../models/alerta.entity';

const alertaRepo = AppDataSource.getRepository(Alerta);

export const AlertaService = {

    // RF36 - Listagem de alertas do médico com filtros
    /* vai à base de dados buscar todos os alertas de um médico específico. 
    Usa createQueryBuilder em vez do find normal porque precisa de filtros opcionais 
    (estado e prioridade). Os alertas são ordenados por prioridade e data. 
    O médico pode filtrar passando ?estado=novo ou ?prioridade=alta no URL (RF36)*/

    listarPorMedico: async (id_medico: number, estado?: string, prioridade?: string) => {
        const query = alertaRepo.createQueryBuilder('alerta')
            .leftJoinAndSelect('alerta.utente', 'utente')
            .leftJoinAndSelect('alerta.avaliacao', 'avaliacao')
            .leftJoinAndSelect('alerta.sintoma', 'sintoma')
            .where('alerta.medico = :id_medico', { id_medico })
            .orderBy('alerta.prioridade', 'DESC')
            .addOrderBy('alerta.data_criacao', 'DESC');

        if (estado) query.andWhere('alerta.estado = :estado', { estado });
        if (prioridade) query.andWhere('alerta.prioridade = :prioridade', { prioridade });

        return await query.getMany();
    },

    // RF38 - Consulta de alertas pelo utente
    /* Busca todos os alertas de um utente específico, ordenados do mais recente para o mais antigo. 
    Usa select para limitar os campos retornados, mostrando apenas o essencial ao utente: tipo, prioridade, estado, motivo e data (RF38)*/
    
    listarPorUtente: async (id_utente: number) => {
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
            }
        });
    },

    // Buscar alerta por id
    buscarPorId: async (id: number) => {
        return await alertaRepo.findOne({
            where: { id },
            relations: ['utente', 'medico', 'avaliacao', 'sintoma']
        });
    },

    // RF29, RF30, RF31, RF32, RF33 - Gerar alerta automático
    gerarAlerta: async (
        id_utente: number,
        id_medico: number,
        tipo: TipoAlerta,
        motivo: string,
        id_avaliacao?: number,
        id_sintoma?: number
    ) => {
        // RF33 - Cálculo automático da prioridade
        const prioridade = AlertaService.calcularPrioridade(tipo);

        const alerta = alertaRepo.create({
            utente: { id: id_utente },
            medico: { id: id_medico },
            avaliacao: id_avaliacao ? { id: id_avaliacao } : null,
            sintoma: id_sintoma ? { id: id_sintoma } : null,
            tipo,
            prioridade,
            estado: EstadoAlerta.NOVO,
            motivo
        });

        return await alertaRepo.save(alerta);
    },

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
    atualizarEstado: async (id: number, estado: EstadoAlerta) => {
        await alertaRepo.update(id, { estado });
        return await alertaRepo.findOne({
            where: { id },
            relations: ['utente', 'medico']
        });
    },

};