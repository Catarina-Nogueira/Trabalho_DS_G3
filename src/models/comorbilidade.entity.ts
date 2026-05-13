import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Utente } from './utente.entity';

@Entity()
export class Comorbilidade {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //chave estrangeira (id_utente)
    // Muitas comorbilidades podem pertencer ao mesmo utente
    @ManyToOne(() => Utente)
    @JoinColumn({ name: 'id_utente' })
    utente!: Utente;

    @Column()
    nome!: string;

    @Column()
    descricao!: string;

}