import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Questionario_Carat } from './questionarioCarat.entity';


@Entity()
export class Questao_Carat {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //chave estrangeira (id_questionario)
    // Muitas questões podem pertencer ao mesmo questionário
    @ManyToOne(() => Questionario_Carat)
    @JoinColumn({ name: 'id_questionario' })
    questionario!: Questionario_Carat;

    @Column()
    texto_questao!: string;


}