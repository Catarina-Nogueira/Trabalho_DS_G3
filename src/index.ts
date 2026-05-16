import 'reflect-metadata'; //Necessário para o typeORM
import express from 'express'; //Framework web que cria o servidor HTTP
import { AppDataSource } from './database/database'; 

import utilizadorRoutes from './routes/utilizador.routes';
import utenteRoutes from './routes/utente.routes';
import medicoRoutes from './routes/medico.routes';
import administradorRoutes from './routes/administrador.routes';
import alertaRoutes from './routes/alerta.routes';
import auditoriaRoutes from './routes/auditoria.routes';



const app = express(); // Cria o objeto principal da aplicação Express
const PORT = 3000;

// Middleware para parsing de JSON
app.use(express.json());


// Rota inicial para evitar "Cannot GET /" - temporário
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API SaudINOB a funcionar!',
    status: 'OK',
    endpoints: [
      '/utilizadores',
      '/utentes',
      '/medicos',
      '/administradores',
      '/alertas',
      '/auditoria'
    ]
  });
});

// Rotas
app.use('/utilizadores', utilizadorRoutes);
app.use('/utentes', utenteRoutes);
app.use('/medicos', medicoRoutes);
app.use('/administradores', administradorRoutes);
app.use('/alertas', alertaRoutes);
app.use('/auditoria', auditoriaRoutes);




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