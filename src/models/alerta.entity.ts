import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Avaliacao_Carat } from './avaliacaoCarat.entity';
import { Sintoma_Reportado } from './sintomaReportado.entity';
import { Utente } from './utente.entity'; 
import { Medico } from './medico.entity';


@Entity()
export class Alerta {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //chave estrangeira (id_avaliacao, id_sintomas, id_utente, id_medico)
    // Muitos alertas podem pertencer à mesma avaliação
    @ManyToOne(() => Avaliacao_Carat)
    @JoinColumn({ name: 'id_avaliacao' })
    avaliacao!: Avaliacao_Carat;

    // Muitos alertas podem estar associados ao mesmo sintoma
    @ManyToOne(() => Sintoma_Reportado)
    @JoinColumn({ name: 'id_sintoma' })
    sintoma!: Sintoma_Reportado;

    // Muitos alertas podem pertencer ao mesmo utente
    @ManyToOne(() => Utente)
    @JoinColumn({ name: 'id_utente' })
    utente!: Utente;

    // Muitos alertas podem estar associados ao mesmo médico
    @ManyToOne(() => Medico)
    @JoinColumn({ name: 'id_medico' })
    medico!: Medico;

    @Column()
    tipo!: string;

    @Column()
    prioridade!: string;

    @Column()
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