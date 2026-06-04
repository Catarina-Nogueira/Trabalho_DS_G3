import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum Tipo_Utilizador {
    ADMINISTRADOR = 'administrador',
    MEDICO = 'medico',
    UTENTE = 'utente'
}

export enum Estado {
    ATIVO = 'ativo',
    INATIVO = 'inativo'
}

@Entity()
export class Utilizador {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    @Column()
    password!: string;

    @Column({ type: 'simple-enum', enum: Tipo_Utilizador })
    tipo_utilizador!: Tipo_Utilizador;

    @Column({ unique: true })
    email!: string;

    // Atalho do TypeORM para criação automática
    @CreateDateColumn()
    data_criacao!: Date;

    //O TypeORM atualiza este valor automaticamente sempre que o registo é modificado
    @UpdateDateColumn()
    data_ultimo_acesso!: Date

    @Column({ type: 'simple-enum', enum: Estado })
    estado!: Estado
}