import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Avaliacao_Carat } from './avaliacaoCarat.entity';
import { Sintoma_Reportado } from './sintomaReportado.entity';
import { Utente } from './utente.entity'; 
import { Medico } from './medico.entity';


export enum TipoAlerta {
    SCORE_CARAT = 'score_carat',           // alerta gerado por score baixo no CARAT
    SINTOMA_GRAVE = 'sintoma_grave',       // alerta gerado por sintoma grave reportado
    MEDICACAO = 'medicacao',               // alerta relacionado com medicação
    EXAME_PENDENTE = 'exame_pendente',     // alerta de exame por realizar
    SEM_AVALIACAO = 'sem_avaliacao',       // utente sem avaliação há muito tempo
   
}

export enum PrioridadeAlerta {
    BAIXA = 'baixa',
    MEDIA = 'media',
    ALTA = 'alta'
}

export enum EstadoAlerta {
    NOVO = 'novo',
    VISTO = 'visto',
    EM_SEGUIMENTO = 'em_seguimento',
    FECHADO = 'fechado'
}

@Entity()
export class Alerta {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //chave estrangeira (id_avaliacao, id_sintomas, id_utente, id_medico)
    // Muitos alertas podem pertencer à mesma avaliação
    @ManyToOne(() => Avaliacao_Carat, { nullable: true })
    @JoinColumn({ name: 'id_avaliacao' })
    avaliacao!: Avaliacao_Carat | null;

    // Muitos alertas podem estar associados ao mesmo sintoma
    @ManyToOne(() => Sintoma_Reportado, { nullable: true })
    @JoinColumn({ name: 'id_sintoma' })
    sintoma!: Sintoma_Reportado | null;

    // Muitos alertas podem pertencer ao mesmo utente
    @ManyToOne(() => Utente)
    @JoinColumn({ name: 'id_utente' })
    utente!: Utente;

    // Muitos alertas podem estar associados ao mesmo médico
    @ManyToOne(() => Medico)
    @JoinColumn({ name: 'id_medico' })
    medico!: Medico;

    @Column({ type: 'simple-enum', enum: TipoAlerta })
    tipo!: string;

    @Column({ type: 'simple-enum', enum: PrioridadeAlerta })
    prioridade!: string;

    @Column({ type: 'simple-enum', enum: EstadoAlerta, default: EstadoAlerta.NOVO })
    estado!: string;

    @Column()
    motivo!: string;

    // Atalho do TypeORM para criação automática
    @CreateDateColumn()
    data_criacao!: Date;

    //O TypeORM atualiza este valor automaticamente sempre que o registo é modificado
    @UpdateDateColumn()
    data_atualizacao!: Date

}