import { Router } from 'express';
import { HistoriaFamiliarController } from '../controllers/historiaFamiliar.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

// Leituras: Médicos, Admins e o próprio Utente têm acesso
router.get('/utente/:id_utente', autenticarSessao, autorizarSessao( 'medico', 'utente'), HistoriaFamiliarController.listarPorUtente);  
router.get('/:id', autenticarSessao, autorizarSessao('medico', 'utente'), HistoriaFamiliarController.buscarPorId);                    

// Escrita (Criar na rota hierárquica): Apenas Administrador e Médico podem intervir
router.post('/utente/:id_utente', autenticarSessao, autorizarSessao('medico'), HistoriaFamiliarController.criar);                                                            

// Atualizar e Eliminar: Protegido apenas para a equipa de saúde/administração
router.put('/:id', autenticarSessao, autorizarSessao('medico'), HistoriaFamiliarController.atualizar);                                      
router.delete('/:id', autenticarSessao, autorizarSessao('medico'), HistoriaFamiliarController.eliminar);                                    

export default router;