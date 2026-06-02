import { Router } from 'express';
import { PlanoAcompanhamentoController } from '../controllers/planoAcompanhamento.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

// Listar planos do utente (Médico e Utente têm acesso)
router.get('/utente/:id_utente', autenticarSessao, autorizarSessao('medico', 'utente'), PlanoAcompanhamentoController.listarPorUtente);     

// Listar planos criados por um médico específico
router.get('/medico/:id_medico', autenticarSessao, autorizarSessao('medico'), PlanoAcompanhamentoController.listarPorMedico);     

// Criar plano acoplado ao id_utente da URL e associado ao médico logado
router.post('/utente/:id_utente', autenticarSessao, autorizarSessao('medico'), PlanoAcompanhamentoController.criar);                    

// Alterar e Eliminar pelo ID do plano
router.put('/:id', autenticarSessao, autorizarSessao('medico'), PlanoAcompanhamentoController.atualizar);                       
router.delete('/:id', autenticarSessao, autorizarSessao('medico'), PlanoAcompanhamentoController.eliminar);                    

export default router;