import { Router } from 'express';
import { UtenteController } from '../controllers/utente.controller';
import { autenticarSessao } from '../middleware.sessao'; // Ajustado o caminho para barra '/'
import { autorizarSessao } from '../middleware.autorizar'; // Novo middleware de autorização

const router = Router();

// Todas as rotas agora usam autenticarSessao e autorizarSessao
router.get('/', autenticarSessao, autorizarSessao('Administrador', 'medico'), UtenteController.listarTodos);
router.get('/medico/:id_medico', autenticarSessao, autorizarSessao('Administrador', 'medico'), UtenteController.listarPorMedico);
router.get('/:id', autenticarSessao, autorizarSessao('Administrador', 'medico'), UtenteController.buscarPorId);
router.get('/:id/dados-permitidos', autenticarSessao, autorizarSessao('Administrador', 'medico', 'utente'), UtenteController.buscarDadosPermitidos);
router.post('/', autenticarSessao, autorizarSessao('Administrador'), UtenteController.criar);
router.put('/:id', autenticarSessao, autorizarSessao('Administrador', 'medico', 'utente'), UtenteController.atualizar);
router.delete('/:id', autenticarSessao, autorizarSessao('Administrador'), UtenteController.eliminar);

export default router;