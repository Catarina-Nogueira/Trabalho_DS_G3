import { AppDataSource } from '../database/database';
import { Comorbilidade } from '../models/comorbilidade.entity';
import { CriarComorbilidadeDTO, AtualizarComorbilidadeDTO } from '../dtos/comorbilidade.dto';

const comorbilidadeRepo = AppDataSource.getRepository(Comorbilidade);

export const ComorbilidadeService = {

    buscarPorId: async (id: number) => {
        return await comorbilidadeRepo.findOne({
            where: { id },
            relations: ['utente']
        });
    },

    listarPorUtente: async (id_utente: number) => {
        return await comorbilidadeRepo.find({
            where: { utente: { id: id_utente } },
            relations: ['utente'],
            order: { nome: 'ASC' }
        });
    },

    criar: async (id_utente: number, dados: CriarComorbilidadeDTO) => {
        const comorbilidade = comorbilidadeRepo.create({
            nome: dados.nome.trim(),
            descricao: dados.descricao.trim(),
            utente: { id: id_utente }
        });
        
        const guardado = await comorbilidadeRepo.save(comorbilidade);
        
        return await comorbilidadeRepo.findOne({
            where: { id: guardado.id },
            relations: ['utente']
        });
    },

    atualizar: async (id: number, dados: AtualizarComorbilidadeDTO) => {
        const comorbilidade = await comorbilidadeRepo.findOne({ where: { id }, relations: ['utente'] });
        if (!comorbilidade) return null;

        // Type Narrowing defensivo compatível com exactOptionalPropertyTypes
        if (dados.nome !== undefined) {
            comorbilidade.nome = dados.nome.trim();
        }
        if (dados.descricao !== undefined) {
            comorbilidade.descricao = dados.descricao.trim();
        }

        return await comorbilidadeRepo.save(comorbilidade);
    },

    eliminar: async (id: number) => {
        const comorbilidade = await comorbilidadeRepo.findOne({ where: { id } });
        if (!comorbilidade) throw new Error('Comorbilidade não encontrada.');
        
        await comorbilidadeRepo.remove(comorbilidade);
    }
};