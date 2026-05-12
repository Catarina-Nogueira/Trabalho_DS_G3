import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column } from 'typeorm';
import { Utilizador } from './utilizador.entity';

@Entity()
export class Administrador {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //Chave estrangeira
    @OneToOne(() => Utilizador) 
    @JoinColumn({ name: 'id_utilizador' })
    utilizador!: Utilizador;

    @Column()
    nome!: string;

}
