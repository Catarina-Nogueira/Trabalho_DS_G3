import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Utente } from './utente.entity';
import { Medicacao } from './medicacao.entity';

@Entity()
export class Medicacao_Utente {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //chave estrangeira (id_utente, id_medicacao)
    // Muitas medicações podem pertencer ao mesmo utente
    @ManyToOne(() => Utente)
    @JoinColumn({ name: 'id_utente' })
    utente!: Utente;

    // Muitos registos podem estar associados à mesma medicação
    @ManyToOne(() => Medicacao)
    @JoinColumn({ name: 'id_medicacao' })
    medicacao!: Medicacao;

    @Column()
    frequencia!: string;

    @Column({ type: 'date' })
    data_inicio!: string;

    @Column()
    duracao!: string;

}