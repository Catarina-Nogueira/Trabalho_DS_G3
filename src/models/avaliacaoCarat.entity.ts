import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';


@Entity()
export class Avaliacao_Carat {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //Falta a chave estrangeira (id_utente, id_medico, id_questionario)

    // Atalho do TypeORM para criação automática
    @CreateDateColumn()
    data_avaliacao!: Date;
    
    @Column()
    nivel_controlo!: string;

    @Column()
    score_total!: number;

}