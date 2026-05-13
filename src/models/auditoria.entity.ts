import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Utilizador } from './utilizador.entity';

@Entity()
export class Auditoria {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //chave estrangeira (id_utilizador)
    // Muitas auditorias podem pertencer ao mesmo utilizador
    @ManyToOne(() => Utilizador)
    @JoinColumn({ name: 'id_utilizador' })
    utilizador!: Utilizador;

    @Column()
    entidade_afetada!: string;

    @Column()
    acao!: string;

    // Atalho do TypeORM para criação automática
    @CreateDateColumn()
    data!: Date;

}