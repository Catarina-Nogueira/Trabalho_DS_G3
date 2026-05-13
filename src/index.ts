import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './database/database';

const app = express();
const PORT = 3000;

// Middleware para parsing de JSON
app.use(express.json());

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