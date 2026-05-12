import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity()
export class Alerta {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //Falta a chave estrangeira (id_avaliacao, id_sintomas, id_utente, id_medico)

    @Column()
    tipo!: string;

    @Column()
    prioridade!: string;

    @Column()
    estado!: string;

    @Column()
    motivo!: string;

    // Atalho do TypeORM para criação automática
    @CreateDateColumn()
    data_criacao!: Date;

    //O TypeORM atualiza este valor automaticamente sempre que o registo é modificado
    @UpdateDateColumn()
    data_atualizacao!: Date

}