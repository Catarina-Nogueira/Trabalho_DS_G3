// src/routes/questionarioCarat.routes.ts
import { Router } from 'express';
import { QuestionarioCaratController } from '../controllers/questionarioCarat.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

// Qualquer utilizador autenticado (Utente, Médico, Admin) pode puxar o questionário ativo para preencher ou visualizar
router.get('/ativo', autenticarSessao, autorizarSessao('administrador', 'medico', 'utente'), QuestionarioCaratController.obterAtivo);

// Todas as restantes rotas são EXCLUSIVAS do Administrador para gestão do sistema
router.get('/', autenticarSessao, autorizarSessao('administrador'), QuestionarioCaratController.listarTodos);
router.get('/:id', autenticarSessao, autorizarSessao('administrador'), QuestionarioCaratController.buscarPorId);
router.post('/', autenticarSessao, autorizarSessao('administrador'), QuestionarioCaratController.criar);
router.patch('/:id/ativar', autenticarSessao, autorizarSessao('administrador'), QuestionarioCaratController.ativar);
router.patch('/:id/desativar', autenticarSessao, autorizarSessao('administrador'), QuestionarioCaratController.desativar);
router.delete('/:id', autenticarSessao, autorizarSessao('administrador'), QuestionarioCaratController.eliminar);

export default router;