import { Router } from 'express';
import { ExameController } from '../controllers/exame.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

// Acesso de Leitura ao catálogo
router.get('/', autenticarSessao, autorizarSessao('medico', 'administrador'), ExameController.listarTodos);
router.get('/nome/:nome_exame', autenticarSessao, autorizarSessao('medico', 'administrador'), ExameController.buscarPorNome);
router.get('/:id', autenticarSessao, autorizarSessao('medico', 'administrador'), ExameController.buscarPorId);

// Gestão de Infraestrutura do Catálogo (Apenas Administrador)
router.post('/', autenticarSessao, autorizarSessao('administrador'), ExameController.criar); // Se for o catálogo de exames base
router.put('/:id', autenticarSessao, autorizarSessao('administrador'), ExameController.atualizar);
router.delete('/:id', autenticarSessao, autorizarSessao('administrador'), ExameController.eliminar);

export default router;