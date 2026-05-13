import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Utilizador } from './utilizador.entity';


@Entity()
export class Medico {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //chave estrangeira (id_utilizador)
    // Um médico corresponde a um único utilizador
    @OneToOne(() => Utilizador)
    @JoinColumn({ name: 'id_utilizador' })
    utilizador!: Utilizador;

    @Column()
    nome!: string;

    @Column()
    especialidade!: string;

    @Column({ unique: true })
    numero_medico!: number;

    @Column({ unique: true })
    telemovel!: string;

}