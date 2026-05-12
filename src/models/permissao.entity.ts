import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from 'typeorm';


@Entity()
export class Permissao {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    designacao!: string;

    @Column()
    descricao!: string;
    
    // Atalho do TypeORM para criação automática
    @CreateDateColumn()
    data_criacao!: Date;
}