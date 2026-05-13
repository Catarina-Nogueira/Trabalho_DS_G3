import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Utente } from './utente.entity';

@Entity()
export class Sintoma_Reportado {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    // chave estrangeira (id_utente)
    // Muitos sintomas podem ser reportados pelo mesmo utente
    @ManyToOne(() => Utente)
    @JoinColumn({ name: 'id_utente' })
    utente!: Utente;

    @Column({type: 'integer'})
    nivel_mal_estar_geral!: number;

    @Column({type: 'integer'})
    sintomas_pulmonares!: number;

    @Column({type: 'integer'})
    sintomas_nasais!: number;

    @CreateDateColumn()
    data_registo!: Date;

    @Column({type:'integer'})
    interrupcao_sono!: number;

    @Column({type: 'integer'})
    uso_medicacao_resgate!: number;

    @Column({type: 'integer'})
    gatilho_identificavel!: number;

    @Column({nullable: true})
    notas_adicionais!: string | null;

}