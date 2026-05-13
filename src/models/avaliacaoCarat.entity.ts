import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Utente } from './utente.entity';
import { Medico } from './medico.entity';
import { Questionario_Carat } from './questionarioCarat.entity';

export enum NivelControlo {
    CONTROLADO = 'controlado',
    PARCIALMENTE_CONTROLADO = 'parcialmente_controlado',
    NAO_CONTROLADO = 'nao_controlado'
}

@Entity()
export class Avaliacao_Carat {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //chave estrangeira (id_utente, id_medico, id_questionario)
    // Muitas avaliações podem pertencer ao mesmo utente
    @ManyToOne(() => Utente)
    @JoinColumn({ name: 'id_utente' })
    utente!: Utente;

    // Muitas avaliações podem ser feitas pelo mesmo médico
    @ManyToOne(() => Medico)
    @JoinColumn({ name: 'id_medico' })
    medico!: Medico;

    // Muitas avaliações podem usar o mesmo questionário
    @ManyToOne(() => Questionario_Carat)
    @JoinColumn({ name: 'id_questionario' })
    questionario!: Questionario_Carat;

    // Atalho do TypeORM para criação automática
    @CreateDateColumn()
    data_avaliacao!: Date;
    
    @Column({ type: 'simple-enum', enum: NivelControlo })
    nivel_controlo!: string;

    @Column({type: 'integer'})
    score_total!: number;

}