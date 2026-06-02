import { AppDataSource } from '../database/database';
import { Comorbilidade } from '../models/comorbilidade.entity';
import { CriarComorbilidadeDTO, AtualizarComorbilidadeDTO } from '../dtos/comorbilidade.dto';

const comorbilidadeRepo = AppDataSource.getRepository(Comorbilidade);

export const ComorbilidadeService = {

    // RF53 - Listar todas as comorbilidades de um utente
    listarPorUtente: async (id_utente: number) => {
        return await comorbilidadeRepo.find({
            where: { utente: { id: id_utente } },
            relations: ['utente']
        });
    },

     // RF53 - Adicionar comorbilidade a um utente
    criar: async (id_utente: number, dados: CriarComorbilidadeDTO) => {
        const comorbilidade = comorbilidadeRepo.create({
            nome: dados.nome,
            descricao: dados.descricao,
            utente: { id: id_utente }
        });
        
        const guardado = await comorbilidadeRepo.save(comorbilidade);
        
        return await comorbilidadeRepo.findOne({
            where: { id: guardado.id },
            relations: ['utente']
        });
    },

    // RF53 - Editar comorbilidade existente
    atualizar: async (id: number, dados: AtualizarComorbilidadeDTO) => {
        const existe = await comorbilidadeRepo.findOneBy({ id });
        if (!existe) return null;
        await comorbilidadeRepo.update(id, dados);
        return await comorbilidadeRepo.findOne({ where: { id }, relations: ['utente'] });
    },

    // RF53 - Remover comorbilidade de um utente
    eliminar: async (id: number) => {
        const existe = await comorbilidadeRepo.findOneBy({ id });
        if (!existe) throw new Error('Comorbilidade não encontrada.');
        await comorbilidadeRepo.delete(id);
    }
};