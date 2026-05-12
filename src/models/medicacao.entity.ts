import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';


@Entity()
export class Medicacao {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome_medicamento!: string;

    @Column()
    substancia_ativa!: string;
    
    @Column()
    dosagem!: string;
}