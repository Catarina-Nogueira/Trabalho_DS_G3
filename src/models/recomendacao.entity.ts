import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Avaliacao_Carat } from './avaliacaoCarat.entity';

export enum TipoRecomendacao {
    MEDICACAO = 'medicacao',                     // recomendação de alteração de medicação
    EXAME = 'exame',                             // recomendação de realização de exame
    CONSULTA = 'consulta',                       // recomendação de consulta
    ESTILO_VIDA = 'estilo_vida',                 // recomendação de alteração de estilo de vida
    MONITORIZACAO = 'monitorizacao',             // recomendação de monitorização mais frequente
    INTERVENCAO_URGENTE = 'intervencao_urgente', // recomendação de intervenção urgente
    OUTRO = 'outro'
}

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

    @Column({ type: 'simple-enum', enum: TipoRecomendacao })
    tipo_recomedacao!: string

    @CreateDateColumn()
    data_criacao!: Date

}