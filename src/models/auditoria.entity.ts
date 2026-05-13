import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Utilizador } from './utilizador.entity';

export enum EntidadeAuditoria {
    UTENTE = 'utente',
    MEDICO = 'medico',
    ADMINISTRADOR = 'administrador',
    UTILIZADOR = 'utilizador',
    ALERTA = 'alerta',
    AVALIACAO_CARAT = 'avaliacao_carat',
    RESPOSTA_UTENTE = 'resposta_utente',
    QUESTAO_CARAT = 'questao_carat',
    OPCAO_RESPOSTA = 'opcao_resposta',
    QUESTIONARIO_CARAT = 'questionario_carat',
    SINTOMA_REPORTADO = 'sintoma_reportado',
    MEDICACAO_UTENTE = 'medicacao_utente',
    MEDICACAO = 'medicacao',
    EXAME_UTENTE = 'exame_utente',
    EXAME = 'exame',
    PLANO_ACOMPANHAMENTO = 'plano_acompanhamento',
    CONFIGURACAO = 'configuracao',
    AUDITORIA = 'auditoria',
    RECOMENDACAO = 'recomendacao',
    COMORBILIDADE = 'comorbilidade',
    HISTORIA_FAMILIAR = 'historia_familiar',
    DADO_ADMINISTRATIVO = 'dado_administrativo',
    PERMISSAO = 'permissao'

}

export enum AcaoAuditoria {
    CRIAR = 'criar',
    ATUALIZAR = 'atualizar',
    ELIMINAR = 'eliminar',
    CONSULTAR = 'consultar',
    LOGIN = 'login',
    LOGOUT = 'logout'
}

@Entity()
export class Auditoria {

    //Auto-incremento
    @PrimaryGeneratedColumn()
    id!: number;

    //chave estrangeira (id_utilizador)
    // Muitas auditorias podem pertencer ao mesmo utilizador
    @ManyToOne(() => Utilizador)
    @JoinColumn({ name: 'id_utilizador' })
    utilizador!: Utilizador;

    @Column({ type: 'simple-enum', enum: EntidadeAuditoria })
    entidade_afetada!: string;

    @Column({ type: 'simple-enum', enum: AcaoAuditoria })
    acao!: string;

    // Atalho do TypeORM para criação automática
    @CreateDateColumn()
    data!: Date;

}