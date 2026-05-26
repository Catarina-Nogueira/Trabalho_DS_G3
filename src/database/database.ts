import 'reflect-metadata';
import { DataSource } from 'typeorm';


import { Utilizador } from '../models/utilizador.entity';
import { Medico } from '../models/medico.entity';
import { Administrador } from '../models/administrador.entity';
import { Utente } from '../models/utente.entity';
import { Avaliacao_Carat } from '../models/avaliacaoCarat.entity';
import { Resposta_Utente } from '../models/respostaUtente.entity';
import { Opcao_Resposta } from '../models/opcaoResposta.entity';
import { Questao_Carat } from '../models/questaoCarat.entity';
import { Questionario_Carat } from '../models/questionarioCarat.entity';
import { Recomendacao } from '../models/recomendacao.entity';
import { Alerta } from '../models/alerta.entity';
import { Plano_Acompanhamento } from '../models/planoAcompanhamento.entity';
import { Medicacao_Utente } from '../models/medicacaoUtente.entity';
import { Medicacao } from '../models/medicacao.entity';
import { Exame_Utente } from '../models/exameUtente.entity';
import { Exame } from '../models/exame.entity';
import { Sintoma_Reportado } from '../models/sintomaReportado.entity';
import { Historia_Familiar } from '../models/historiaFamiliar.entity';
import { Comorbilidade } from '../models/comorbilidade.entity';
import { Dado_Administrativo } from '../models/dadoAdministrativo.entity';
import { Permissao } from '../models/permissao.entity';
import { Auditoria } from '../models/auditoria.entity';
import { Configuracao } from '../models/configuracao.entity';
import { Utilizador_Permissao } from '../models/utilizadorPermissao.entity';

export const AppDataSource = new DataSource({
    type: 'better-sqlite3',
    database: 'data.db',
    entities: [Utilizador, Medico, Administrador, Utente, Avaliacao_Carat, Resposta_Utente, Opcao_Resposta, 
        Questao_Carat, Questionario_Carat, Recomendacao, Alerta, Plano_Acompanhamento, Medicacao_Utente,
        Medicacao, Exame_Utente, Exame, Sintoma_Reportado, Historia_Familiar, Comorbilidade, Dado_Administrativo,
        Permissao,  Auditoria, Configuracao, Utilizador_Permissao],
    synchronize: true,
});