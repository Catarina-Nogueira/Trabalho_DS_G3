import { Router } from 'express';
import { MedicacaoController } from '../controllers/medicacao.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

// Qualquer utilizador autenticado no sistema (Médico ou Utente) pode consultar o catálogo
router.get('/', autenticarSessao, autorizarSessao('medico', 'administrador'), MedicacaoController.listarTodos);
router.get('/nome/:nome_medicamento', autenticarSessao, autorizarSessao('medico', 'administrador'), MedicacaoController.buscarPorNome);
router.get('/:id', autenticarSessao, autorizarSessao('medico', 'administrador'), MedicacaoController.buscarPorId);

// Apenas o Administrador (ou o Médico se permitires no teu modelo de negócio) pode alterar o catálogo global
router.post('/', autenticarSessao, autorizarSessao('administrador'), MedicacaoController.criar);
router.put('/:id', autenticarSessao, autorizarSessao('administrador'), MedicacaoController.atualizar);
router.delete('/:id', autenticarSessao, autorizarSessao('administrador'), MedicacaoController.eliminar);

export default router;