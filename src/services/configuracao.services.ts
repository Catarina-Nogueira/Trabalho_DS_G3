import { AppDataSource } from '../database/database';
import { Configuracao } from '../models/configuracao.entity';

const configuracaoRepo = AppDataSource.getRepository(Configuracao);

export const ConfiguracaoService = {

    // RF12 - Listar todos os parâmetros de configuração
    listarTodos: async () => {
        return await configuracaoRepo.find({
            relations: ['administrador']
        });
    },

    // RF12 - Consultar detalhe de um parâmetro específico
    buscarPorId: async (id: number) => {
        return await configuracaoRepo.findOne({
            where: { id },
            relations: ['administrador']
        });
    },

    // RF12 - Criar novo parâmetro de configuração
    criar: async (dados: Partial<Configuracao>) => {
        const configuracao = configuracaoRepo.create(dados);
        return await configuracaoRepo.save(configuracao);
    },

    // RF11 - Buscar limiar por nome do parâmetro (ex: 'score_minimo', 'delta_deterioracao')
    buscarPorNome: async (nome_parametro: string) => {
        return await configuracaoRepo.findOne({
            where: { nome_parametro }
        });
    },

    // RF12/RF11 - Editar parâmetro existente (ex: atualizar limiar de score CARAT)
    atualizar: async (id: number, dados: Partial<Configuracao>) => {
        // RF13 - Validação do valor antes de persistir
        if (dados.valor_limiar !== undefined && dados.valor_limiar < 0) {
            throw new Error('O valor do limiar não pode ser negativo');
        }
        await configuracaoRepo.update(id, dados);
        return await configuracaoRepo.findOne({
            where: { id },
            relations: ['administrador']
        });
    },

    // RF12 - Eliminar parâmetro de configuração
    eliminar: async (id: number) => {
        return await configuracaoRepo.delete(id);
    }
};