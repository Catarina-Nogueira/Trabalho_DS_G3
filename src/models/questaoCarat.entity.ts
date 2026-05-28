import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Questionario_Carat } from './questionarioCarat.entity';
import { Opcao_Resposta } from './opcaoResposta.entity'


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

    @Column({ type: 'text'})
    texto_questao!: string;

    @OneToMany(() => Opcao_Resposta, (opcao) => opcao.questao, { cascade: true })
    opcoes!: Opcao_Resposta[];
}