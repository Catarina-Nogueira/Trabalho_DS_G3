import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Avaliacao_Carat } from './avaliacaoCarat.entity';
import { Opcao_Resposta } from './opcaoResposta.entity';

@Entity()
export class Resposta_Utente {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    // chave estrangeira (id_avaliacao, id_opcao)
    @ManyToOne(() => Avaliacao_Carat)
    @JoinColumn({ name: 'id_avaliacao' })
    avaliacao!: Avaliacao_Carat;

    @ManyToOne(() => Opcao_Resposta)
    @JoinColumn({ name: 'id_opcao' })
    opcao!: Opcao_Resposta;

}