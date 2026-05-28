import { Entity, PrimaryGeneratedColumn, Column , OneToMany} from 'typeorm';
import { Questao_Carat } from './questaoCarat.entity';

@Entity()
export class Questionario_Carat {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar2', unique: true })
    versao!: string;

    @Column({type: 'date'})
    data_ativacao!: string

    @Column({type: 'date', nullable: true})
    data_desativacao!: string | null

    @OneToMany(() => Questao_Carat, (questao) => questao.questionario, { cascade: true })
    questoes!: Questao_Carat[];

}