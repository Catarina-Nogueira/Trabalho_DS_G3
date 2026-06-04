import { Router } from 'express';
import { HistoriaFamiliarController } from '../controllers/historiaFamiliar.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

router.get('/utente/:id_utente', autenticarSessao, autorizarSessao('medico', 'utente'), HistoriaFamiliarController.listarPorUtente);  
router.get('/:id', autenticarSessao, autorizarSessao('medico', 'utente'), HistoriaFamiliarController.buscarPorId);                                        
router.post('/utente/:id_utente', autenticarSessao, autorizarSessao('medico'), HistoriaFamiliarController.criar);                                                                                                    
router.patch('/:id', autenticarSessao, autorizarSessao('medico'), HistoriaFamiliarController.atualizar);                                             
router.delete('/:id', autenticarSessao, autorizarSessao('medico'), HistoriaFamiliarController.eliminar);                                    

export default router;