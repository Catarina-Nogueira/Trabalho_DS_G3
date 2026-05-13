import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
import { Utente } from './utente.entity';
import { Medico } from './medico.entity';
import { Exame } from './exame.entity';

@Entity()
export class Exame_Utente {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    // chave estrangeira (id_utente, id_medico, id_exame)
    // Muitos exames podem pertencer ao mesmo utente
    @ManyToOne(() => Utente)
    @JoinColumn({ name: 'id_utente' })
    utente!: Utente;

    // Muitos exames podem ser requisitados pelo mesmo médico
    @ManyToOne(() => Medico)
    @JoinColumn({ name: 'id_medico' })
    medico!: Medico;

    // Muitos exames do utente podem ser do mesmo tipo de exame
    @ManyToOne(() => Exame)
    @JoinColumn({ name: 'id_exame' })
    exame!: Exame;

    @Column({ type: 'timestamp' }) //O TypeORM não consegue inferir automaticamente que é uma data, por isso é necessário especificar o tipo explicitamente, caso contrário pode guardar como texto.
    data_exame!: Date;

    @Column({ type: 'timestamp', nullable: true })
    data_resultado!: Date | null;

    @Column({nullable: true })
    resultado!: string | null;
    
    //A interpretacao pode não existir no momento em que o exame é criado (o resultado pode ainda não estar disponível), por isso faz sentido permitir que o campo seja nulo. Sem o nullable: true o TypeORM obrigaria a preencher sempre o campo.
    @Column({ nullable: true })
    interpretacao!: string | null;
}