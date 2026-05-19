import { Router } from 'express';
import { DadoAdministrativoController } from '../controllers/dadoAdministrativo.controller';

const router = Router();

router.get('/utente/:id_utente', DadoAdministrativoController.buscarPorUtente);  // RF06
router.get('/:id', DadoAdministrativoController.buscarPorId);                    // RF06
router.post('/', DadoAdministrativoController.criar);                             // RF06
router.put('/:id', DadoAdministrativoController.atualizar);                      // RF05
router.delete('/:id', DadoAdministrativoController.eliminar);

export default router;