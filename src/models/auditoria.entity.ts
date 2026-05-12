import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';


@Entity()
export class Auditoria {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //Falta a chave estrangeira (id_utilizador)

    @Column()
    entidade_afetada!: string;

    @Column()
    acao!: string;

    // Atalho do TypeORM para criação automática
    @CreateDateColumn()
    data!: Date;

}