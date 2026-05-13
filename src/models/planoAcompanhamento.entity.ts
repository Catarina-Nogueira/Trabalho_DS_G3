import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Medico } from './medico.entity';
import { Utente } from './utente.entity';


@Entity()
export class Plano_Acompanhamento {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //chave estrangeira (id_medico, id_utente)
    // Muitos planos podem ser geridos pelo mesmo médico
    @ManyToOne(() => Medico)
    @JoinColumn({ name: 'id_medico' })
    medico!: Medico;

    // Muitos planos podem pertencer ao mesmo utente
    @ManyToOne(() => Utente)
    @JoinColumn({ name: 'id_utente' })
    utente!: Utente;

    @Column()
    descricao!: string;

    @Column({ type: 'date' })
    data_inicio!: string;

    @Column({ type: 'date', nullable: true })
    data_fim!: string | null;

}