import { AppDataSource } from '../database/database';
import { Utente } from '../models/utente.entity';

const utenteRepo = AppDataSource.getRepository(Utente);

export const UtenteService = {

    //vai à base de dados e devolve todos os utentes
    listarTodos: async () => {
        return await utenteRepo.find();
    },

    //vai à base de dados e devolve o utente com o id indicado. Se não existir devolve null
    buscarPorId: async (id: number) => {
        return await utenteRepo.findOneBy({ id });
    },

    //cria um novo utilizador na base de dados com os dados recebidos. O create prepara o objeto e o save guarda-o
    /*criar: async (dados: Partial<Utilizador>) => {
        const utilizador = utilizadorRepo.create(dados);
        return await utilizadorRepo.save(utilizador);
    },*/

    /*
    //elimina o utilizador com o id indicado da base de dados:
    eliminar: async (id: number) => {
        return await utilizadorRepo.delete(id);
    }*/
};
// O Partial<Utilizador> significa que não se precisa de enviar todos os campos do utilizador, apenas os que se quer criar ou atualizar.