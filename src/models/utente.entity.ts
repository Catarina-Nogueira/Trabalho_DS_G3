import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, CreateDateColumn, OneToOne, ManyToOne } from 'typeorm';
import { Utilizador } from './utilizador.entity';
import { Medico } from './medico.entity';

@Entity()
export class Utente {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    // chave estrangeira (id_utilizador, id_medico)
    // Um utente corresponde a um único utilizador
    @OneToOne(() => Utilizador)
    @JoinColumn({ name: 'id_utilizador' })
    utilizador!: Utilizador;

    // Muitos utentes podem estar associados ao mesmo médico
    @ManyToOne(() => Medico)
    @JoinColumn({ name: 'id_medico' })
    medico!: Medico;

    @Column()
    nome!: string;

    @Column({ type: 'date' })
    data_nascimento!: string;

    @Column()
    genero!: string;

}