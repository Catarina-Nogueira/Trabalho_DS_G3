import { AppDataSource } from '../database/database';
import { Exame } from '../models/exame.entity';
import { CriarExameDTO, AtualizarExameDTO } from '../dtos/exame.dto';

const exameRepo = AppDataSource.getRepository(Exame);

export const ExameService = {

    listarTodos: async () => {
        return await exameRepo.find({
            order: { nome_exame: 'ASC' }
        });
    },

    buscarPorId: async (id: number) => {
        return await exameRepo.findOne({
            where: { id }
        });
    },

    buscarPorNome: async (nome_exame: string) => {
        return await exameRepo.findOne({
            where: { nome_exame }
        });
    },

    criar: async (dados: CriarExameDTO) => {
        const jaExiste = await exameRepo.findOne({ where: { nome_exame: dados.nome_exame.trim() } });
        if (jaExiste) throw new Error('Já existe um exame registado com este nome.');

        const exame = exameRepo.create({
            nome_exame: dados.nome_exame.trim(),
            descricao: dados.descricao.trim(),
            tipo: dados.tipo
        });
        return await exameRepo.save(exame);
    },

    atualizar: async (id: number, dados: AtualizarExameDTO) => {
        const exame = await exameRepo.findOne({ where: { id } });
        if (!exame) return null;

        // Type Narrowing utilizando !== undefined protege contra a flag estrita do TS
        if (dados.nome_exame !== undefined) {
            exame.nome_exame = dados.nome_exame.trim();
        }
        if (dados.descricao !== undefined) {
            exame.descricao = dados.descricao.trim();
        }
        if (dados.tipo !== undefined) {
            exame.tipo = dados.tipo;
        }

        return await exameRepo.save(exame);
    },

    eliminar: async (id: number) => {
        const exame = await exameRepo.findOne({ where: { id } });
        if (!exame) throw new Error('Exame não encontrado para exclusão.');
        return await exameRepo.remove(exame);
    }
};