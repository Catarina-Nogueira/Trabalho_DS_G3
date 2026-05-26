import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Utilizador } from './utilizador.entity';
import { Permissao } from './permissao.entity';

@Entity()
export class Utilizador_Permissao {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //chave estrangeira (id_utilizador)
    // Muitas permissões podem ser atribuídas ao mesmo utilizador
    @ManyToOne(() => Utilizador)
    @JoinColumn({ name: 'id_utilizador' })
    utilizador!: Utilizador;

    @ManyToOne(() => Permissao)
    @JoinColumn({ name: 'id_permissao' })
    permissao!: Permissao;
    
}