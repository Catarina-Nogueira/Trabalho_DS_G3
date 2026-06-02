import { AppDataSource } from '../database/database';
import { Historia_Familiar } from '../models/historiaFamiliar.entity';
import { CriarHistoriaFamiliarDTO, AtualizarHistoriaFamiliarDTO } from '../dtos/historiaFamiliar.dto';

const historiaRepo = AppDataSource.getRepository(Historia_Familiar);

export const HistoriaFamiliarService = {

    // Listar todas as histórias familiares de um utente
    listarPorUtente: async (id_utente: number) => {
        return await historiaRepo.find({
            where: { utente: { id: id_utente } },
            relations: ['utente']
        });
    },

    // Buscar um registo específico por ID
    buscarPorId: async (id: number) => {
        return await historiaRepo.findOne({
            where: { id },
            relations: ['utente']
        });
    },

    // Adicionar histórico familiar associado ao ID da URL
    criar: async (id_utente: number, dados: CriarHistoriaFamiliarDTO) => {
        const novaHistoria = historiaRepo.create({
            nome: dados.nome,
            descricao: dados.descricao,
            utente: { id: id_utente } // Vincula à chave estrangeira do utente
        });
        
        const guardado = await historiaRepo.save(novaHistoria);
        
        return await historiaRepo.findOne({
            where: { id: guardado.id },
            relations: ['utente']
        });
    },

    // Editar registo existente
    atualizar: async (id: number, dados: AtualizarHistoriaFamiliarDTO) => {
        const existe = await historiaRepo.findOneBy({ id });
        if (!existe) return null;

        await historiaRepo.update(id, dados);
        
        return await historiaRepo.findOne({
            where: { id },
            relations: ['utente']
        });
    },

    // Remover registo de história familiar
    eliminar: async (id: number) => {
        const existe = await historiaRepo.findOneBy({ id });
        if (!existe) throw new Error('Registo de história familiar não encontrado.');
        
        await historiaRepo.delete(id);
    }
};