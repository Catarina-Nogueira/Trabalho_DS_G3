import { Router } from 'express';
import { ComorbilidadeController } from '../controllers/comorbilidades.controller';

const router = Router();

router.get('/utente/:id_utente', ComorbilidadeController.listarPorUtente);  
router.get('/:id', ComorbilidadeController.buscarPorId);                    
router.post('/', ComorbilidadeController.criar);                            
router.put('/:id', ComorbilidadeController.atualizar);                      
router.delete('/:id', ComorbilidadeController.eliminar);                    

export default router;