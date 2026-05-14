import { AppDataSource } from '../database/database';
import { Utilizador } from '../models/utilizador.entity';

const utilizadorRepo = AppDataSource.getRepository(Utilizador);

export const UtilizadorService = {

    //vai à base de dados e devolve todos os utilizadores
    listarTodos: async () => {
        return await utilizadorRepo.find();
    },

    //vai à base de dados e devolve o utilizador com o id indicado. Se não existir devolve null
    buscarPorId: async (id: number) => {
        return await utilizadorRepo.findOneBy({ id });
    },

    //cria um novo utilizador na base de dados com os dados recebidos. O create prepara o objeto e o save guarda-o
    criar: async (dados: Partial<Utilizador>) => {
        const utilizador = utilizadorRepo.create(dados);
        return await utilizadorRepo.save(utilizador);
    },
    //atualiza o utilizador com o id indicado com os novos dados. O update atualiza e depois o findOneBy devolve o utilizador já atualizado
    atualizar: async (id: number, dados: Partial<Utilizador>) => {
        await utilizadorRepo.update(id, dados);
        return await utilizadorRepo.findOneBy({ id });
    },
    //elimina o utilizador com o id indicado da base de dados:
    eliminar: async (id: number) => {
        return await utilizadorRepo.delete(id);
    }
};
// O Partial<Utilizador> significa que não se precisa de enviar todos os campos do utilizador, apenas os que se quer criar ou atualizar.