import { Router } from 'express';
import { DadoAdministrativoController } from '../controllers/dadoAdministrativo.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

router.get('/utente/:id_utente', autenticarSessao, autorizarSessao('administrador', 'utente'), DadoAdministrativoController.buscarPorUtente);  
router.get('/:id', autenticarSessao, autorizarSessao('administrador', 'utente'), DadoAdministrativoController.buscarPorId);                                         
router.post('/utente/:id_utente', autenticarSessao, autorizarSessao('administrador'), DadoAdministrativoController.criar);                             
router.patch('/:id', autenticarSessao, autorizarSessao('utente'), DadoAdministrativoController.atualizar);                       
router.delete('/:id', autenticarSessao, autorizarSessao('administrador'), DadoAdministrativoController.eliminar);

export default router;