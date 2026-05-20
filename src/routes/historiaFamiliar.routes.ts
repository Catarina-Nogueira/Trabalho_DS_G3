import { Router } from 'express';
import { HistoriaFamiliarController } from '../controllers/historiaFamiliar.controller';

const router = Router();

router.get('/utente/:id_utente', HistoriaFamiliarController.listarPorUtente);  
router.get('/:id', HistoriaFamiliarController.buscarPorId);                    
router.post('/', HistoriaFamiliarController.criar);                            
router.put('/:id', HistoriaFamiliarController.atualizar);                      
router.delete('/:id', HistoriaFamiliarController.eliminar);                    

export default router;