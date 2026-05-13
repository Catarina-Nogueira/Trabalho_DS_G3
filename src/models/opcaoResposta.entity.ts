import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Questao_Carat } from './questaoCarat.entity';


@Entity()
export class Opcao_Resposta {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //chave estrangeira (id_questao)
    // Muitas opções de resposta podem pertencer à mesma questão
    @ManyToOne(() => Questao_Carat)
    @JoinColumn({ name: 'id_questao' })
    questao!: Questao_Carat;
    
    @Column()
    texto_opcao!: string;

    @Column({ type: 'integer' })
    score!: number;


}