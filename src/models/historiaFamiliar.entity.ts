import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
import { Utente } from './utente.entity';


@Entity()
export class Historia_Familiar {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    // chave estrangeira (id_utente)
    // Muitas histórias familiares podem pertencer ao mesmo utente
    @ManyToOne(() => Utente)
    @JoinColumn({ name: 'id_utente' })
    utente!: Utente;
    
    @Column({ type: 'text', nullable: true })
    nome!: string | null;
    
    @Column({ type: 'text', nullable: true })
    descricao!: string | null;
}