import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity()
export class Utilizador {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    password!: string;

    @Column()
    tipo_utilizador!: string;

    @Column()
    email!: string;

    // Atalho do TypeORM para criação automática
    @CreateDateColumn()
    data_criacao!: Date;

    //O TypeORM atualiza este valor automaticamente sempre que o registo é modificado
    @UpdateDateColumn()
    data_ultimo_acesso!: Date

    @Column()
    estado!: string
}