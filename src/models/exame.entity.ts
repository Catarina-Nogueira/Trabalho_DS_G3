import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';


@Entity()
export class Exame {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome_exame!: string;

    @Column()
    descricao!: string;
    
    @Column()
    tipo!: string;
}