import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
export class Configuracao {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //Falta a chave estrangeira (id_utente)

    @Column()
    morada!: string;

    @Column()
    nif!: number;

    @Column()
    telemovel!: string;

}