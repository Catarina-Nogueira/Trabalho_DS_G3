import { Router } from 'express';
import { UtenteController } from '../controllers/utente.controller';
import { autenticar, autorizar } from '../autenticacao.middleware';

const router = Router();

router.get('/', autenticar, autorizar ('administrador', 'medico'), UtenteController.listarTodos);
router.get('/medico/:id_medico', autenticar, autorizar ('administrador', 'medico'), UtenteController.listarPorMedico);
router.get('/:id', autenticar, autorizar ('administrador', 'medico'), UtenteController.buscarPorId);                    // RF50
router.get('/:id/dados-permitidos', autenticar, autorizar ('administrador', 'medico'), UtenteController.buscarDadosPermitidos); // RF06
router.post('/', autenticar, autorizar ('administrador', 'medico'), UtenteController.criar);
router.put('/:id', autenticar, autorizar ('administrador', 'medico'), UtenteController.atualizar);                      // RF05
router.delete('/:id', autenticar, autorizar ('administrador', 'medico'), UtenteController.eliminar);

export default router;