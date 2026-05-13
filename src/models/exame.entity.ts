import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

export enum TipoExame {
    LABORATORIAL = 'laboratorial',
    IMAGEM = 'imagem',
    ENDOSCOPICO = 'endoscopico',
    FUNCIONAL = 'funcional'
}

@Entity()
export class Exame {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    nome_exame!: string;

    @Column()
    descricao!: string;
    
    @Column({ type: 'simple-enum', enum: TipoExame })
    tipo!: string;
}