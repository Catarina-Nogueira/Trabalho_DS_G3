import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Utente } from './utente.entity';

@Entity()
export class Dado_Administrativo {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //chave estrangeira (id_utente)
    // Um dado administrativo pertence a um único utente
    @OneToOne(() => Utente)
    @JoinColumn({ name: 'id_utente' })
    utente!: Utente;

    @Column()
    morada!: string;

    @Column({ unique: true })
    nif!: number;

    @Column({ unique: true })
    telemovel!: string;

}