import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Administrador } from './administrador.entity';

@Entity()
export class Configuracao {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //chave estrangeira (id_administrador)
    // Muitas configurações podem ser geridas pelo mesmo administrador
    @ManyToOne(() => Administrador)
    @JoinColumn({ name: 'id_administrador' })
    administrador!: Administrador;

    @Column()
    nome_parametro!: string;

    @Column({type: 'float'})
    valor_limiar!: number;

    @Column()
    descricao!: string;

    //O TypeORM atualiza este valor automaticamente sempre que o registo é modificado
    @UpdateDateColumn()
    data_atualizacao!: Date

}