import { Router } from 'express';
import { ComorbilidadeController } from '../controllers/comorbilidades.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

// GET /comorbilidades/utente/5 -> Listar comorbilidades do utente 5
router.get('/utente/:id_utente', autenticarSessao, autorizarSessao('medico', 'utente'), ComorbilidadeController.listarPorUtente);     

// POST /comorbilidades/utente/5 -> Cria uma comorbilidade DIRETAMENTE no utente 5
router.post('/utente/:id_utente', autenticarSessao, autorizarSessao('medico'), ComorbilidadeController.criar);                             

// PUT e DELETE mantêm-se pelo ID da comorbilidade específica
router.put('/:id', autenticarSessao, autorizarSessao('medico'), ComorbilidadeController.atualizar);                       
router.delete('/:id', autenticarSessao, autorizarSessao('medico'), ComorbilidadeController.eliminar);                    

export default router;