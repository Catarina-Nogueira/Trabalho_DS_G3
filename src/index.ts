import 'reflect-metadata'; //Necessário para o typeORM
import express from 'express'; //Framework web que cria o servidor HTTP
import { AppDataSource } from './database/database'; 
import path from 'path';

import utilizadorRoutes from './routes/utilizador.routes';
import utenteRoutes from './routes/utente.routes';
import medicoRoutes from './routes/medico.routes';
import administradorRoutes from './routes/administrador.routes';
import alertaRoutes from './routes/alerta.routes';
import auditoriaRoutes from './routes/auditoria.routes';
import comorbilidadeRoutes from './routes/comorbilidades.routes';
import configuracaoRoutes from './routes/configuracao.routes';
import dadoAdministrativoRoutes from './routes/dadoAdministrativo.routes';
import exameRoutes from './routes/exame.routes';
import exameUtenteRoutes from './routes/exameUtente.routes';
import historiaFamiliarRoutes from './routes/historiaFamiliar.routes';
import medicacaoRoutes from './routes/medicacao.routes';   
import medicacaoUtenteRoutes from './routes/medicacaoUtente.routes';
import opcaoRespostaRoutes from './routes/opcaoResposta.routes'; 
import permissaoRoutes from './routes/permissao.routes';
import planoAcompanhamentoRoutes from './routes/planoAcompanhamento.routes';
import questaoCaratRoutes from './routes/questaoCarat.routes';
import questionarioCaratRoutes from './routes/questionarioCarat.routes';
import recomendacaoRoutes from './routes/recomendacao.routes';

const app = express(); // Cria o objeto principal da aplicação Express
const PORT = 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));

// Middleware para parsing de JSON
app.use(express.json());


// Rotas
app.use('/utilizadores', utilizadorRoutes);
app.use('/utentes', utenteRoutes);
app.use('/medicos', medicoRoutes);
app.use('/administradores', administradorRoutes);
app.use('/alertas', alertaRoutes);
app.use('/auditoria', auditoriaRoutes);
app.use('/comorbilidades', comorbilidadeRoutes);
app.use('/configuracao', configuracaoRoutes);
app.use('/dadoAdministrativos', dadoAdministrativoRoutes);
app.use('/exames', exameRoutes);
app.use('/exameUtente', exameUtenteRoutes);
app.use('/historiaFamiliar', historiaFamiliarRoutes);
app.use('/medicacao', medicacaoRoutes);
app.use('/medicacaoUtente', medicacaoUtenteRoutes);
app.use('/opcaoResposta', opcaoRespostaRoutes);
app.use('/permissoes', permissaoRoutes);
app.use('/planoAcompanhamento', planoAcompanhamentoRoutes);
app.use('/questaoCarat', questaoCaratRoutes);
app.use('/questionarioCarat', questionarioCaratRoutes);
app.use('/recomendacoes', recomendacaoRoutes);

// Inicializar a base de dados
AppDataSource.initialize()
    .then(() => {
        console.log('Base de dados ligada com sucesso!');

        // Iniciar o servidor só depois da base de dados estar ligada
        app.listen(PORT, () => {
            console.log(`Servidor a correr em http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Erro ao ligar à base de dados:', err);
    });

export default app;