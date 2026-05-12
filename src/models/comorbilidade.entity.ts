import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
export class Comorbilidade {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //Falta a chave estrangeira (id_utente)

    @Column()
    nome!: string;

    @Column()
    descricao!: string;

}