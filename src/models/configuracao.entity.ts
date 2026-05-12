import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';


@Entity()
export class Configuracao {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //Falta a chave estrangeira (id_administrador)

    @Column()
    nome_parametro!: string;

    @Column()
    valor_limiar!: number;

    @Column()
    descricao!: string;

    //O TypeORM atualiza este valor automaticamente sempre que o registo é modificado
    @UpdateDateColumn()
    data_atualizacao!: Date

}