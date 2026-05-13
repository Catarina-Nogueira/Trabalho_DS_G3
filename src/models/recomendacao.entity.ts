import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Avaliacao_Carat } from './avaliacaoCarat.entity';

@Entity()
export class Recomendacao {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    // chave estrangeira (id_avaliacao)
    // Muitas recomendações podem pertencer à mesma avaliação
    @ManyToOne(() => Avaliacao_Carat)
    @JoinColumn({ name: 'id_avaliacao' })
    avaliacao!: Avaliacao_Carat;

    @Column()
    texto_recomendacao!: string;

    @Column()
    tipo_recomedacao!: string

    @CreateDateColumn()
    data_criacao!: Date

}