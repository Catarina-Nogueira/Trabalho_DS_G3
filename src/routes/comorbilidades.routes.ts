import { Router } from 'express';
import { ComorbilidadeController } from '../controllers/comorbilidades.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

router.get('/utente/:id_utente', autenticarSessao, autorizarSessao('medico', 'utente'), ComorbilidadeController.listarPorUtente);     
router.post('/utente/:id_utente', autenticarSessao, autorizarSessao('medico'), ComorbilidadeController.criar);                             
router.patch('/:id', autenticarSessao, autorizarSessao('medico'), ComorbilidadeController.atualizar);                       
router.delete('/:id', autenticarSessao, autorizarSessao('medico'), ComorbilidadeController.eliminar);                    

export default router;