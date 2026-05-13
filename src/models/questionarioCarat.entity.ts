import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Questionario_Carat {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    versao!: string;

    @Column({type: 'date'})
    data_ativacao!: string

    @Column({type: 'date', nullable: true})
    data_desativacao!: string | null

}