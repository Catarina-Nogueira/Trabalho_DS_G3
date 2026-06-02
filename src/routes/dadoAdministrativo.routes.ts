import { Router } from 'express';
import { DadoAdministrativoController } from '../controllers/dadoAdministrativo.controller';
import { autenticarSessao } from '../middleware.sessao';
import { autorizarSessao } from '../middleware.autorizar';

const router = Router();

// Consultar: Apenas o Administrador e o próprio Utente podem ler
router.get('/utente/:id_utente', autenticarSessao, autorizarSessao('administrador', 'utente'), DadoAdministrativoController.buscarPorUtente);  
router.get('/:id', autenticarSessao, autorizarSessao('administrador', 'utente'), DadoAdministrativoController.buscarPorId);                    

// Criar: Normalmente gerado pelo Administrador ao registar o utente no sistema
router.post('/utente/:id_utente', autenticarSessao, autorizarSessao('administrador'), DadoAdministrativoController.criar);                             

// Modificar: Trancado estritamente para o perfil 'utente' (RF05)
router.put('/:id', autenticarSessao, autorizarSessao('utente'), DadoAdministrativoController.atualizar);                       

// Eliminar: Trancado apenas para o Administrador
router.delete('/:id', autenticarSessao, autorizarSessao('administrador'), DadoAdministrativoController.eliminar);

export default router;