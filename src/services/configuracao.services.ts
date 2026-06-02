import { AppDataSource } from '../database/database';
import { Configuracao } from '../models/configuracao.entity';
import { Administrador } from '../models/administrador.entity';
import { CriarConfiguracaoDTO, AtualizarConfiguracaoDTO, ConfiguracaoRespostaDTO } from '../dtos/configuracao.dto';

const configuracaoRepo = AppDataSource.getRepository(Configuracao);
const administradorRepo = AppDataSource.getRepository(Administrador);

const toResposta = (c: Configuracao): ConfiguracaoRespostaDTO => ({
    id: c.id,
    nome_parametro: c.nome_parametro,
    valor_limiar: c.valor_limiar,
    descricao: c.descricao,
    data_atualizacao: c.data_atualizacao,
    administrador: {
        id: c.administrador?.id,
        nome: c.administrador?.nome || 'Administrador do Sistema'
    }
});

export const ConfiguracaoService = {

    // RF12 - Listar todos os parâmetros de configuração
    listarTodas: async (): Promise<ConfiguracaoRespostaDTO[]> => {
        const configs = await configuracaoRepo.find({
            relations: ['administrador']
        });
        return configs.map(toResposta);
    },

     buscarPorNome: async (nome_parametro: string): Promise<ConfiguracaoRespostaDTO | null> => {
        const config = await configuracaoRepo.findOne({
            where: { nome_parametro },
            relations: ['administrador']
        });
        if (!config) return null;
        return toResposta(config);
    },

    buscarPorId: async (id: number): Promise<ConfiguracaoRespostaDTO | null> => {
        const config = await configuracaoRepo.findOne({
            where: { id },
            relations: ['administrador']
        });
        if (!config) return null;
        return toResposta(config);
    },

    criar: async (dados: CriarConfiguracaoDTO, id_utilizador_sessao: number): Promise<ConfiguracaoRespostaDTO> => {
        // Encontrar o perfil de Administrador associado ao Utilizador da sessão
        const admin = await administradorRepo.findOne({ where: { utilizador: { id: id_utilizador_sessao } } });
        if (!admin) throw new Error('Perfil de administrador não encontrado para esta sessão.');

        const nomeNormalizado = dados.nome_parametro.trim().toUpperCase();
        
        const existente = await configuracaoRepo.findOne({ where: { nome_parametro: nomeNormalizado } });
        if (existente) throw new Error(`O parâmetro '${nomeNormalizado}' já existe. Utilize a rota de atualização.`);

        const novaConfig = configuracaoRepo.create({
            nome_parametro: nomeNormalizado,
            valor_limiar: dados.valor_limiar,
            descricao: dados.descricao.trim(),
            administrador: admin
        });

        const guardada = await configuracaoRepo.save(novaConfig);
        
        // Recarregar relações
        const completa = await configuracaoRepo.findOne({ where: { id: guardada.id }, relations: ['administrador'] });
        return toResposta(completa!);
    },

    // RF12/RF11 - Editar parâmetro existente (ex: atualizar limiar de score CARAT)
    atualizar: async (id: number, dados: AtualizarConfiguracaoDTO, id_utilizador_sessao: number): Promise<ConfiguracaoRespostaDTO | null> => {
        const config = await configuracaoRepo.findOne({ where: { id }, relations: ['administrador'] });
        if (!config) return null;

        const admin = await administradorRepo.findOne({ where: { utilizador: { id: id_utilizador_sessao } } });
        if (!admin) throw new Error('Perfil de administrador não encontrado para esta sessão.');

        if (dados.valor_limiar !== undefined) config.valor_limiar = dados.valor_limiar;
        if (dados.descricao) config.descricao = dados.descricao.trim();
        
        // Atualiza quem foi o último administrador a mexer no parâmetro
        config.administrador = admin;

        const atualizada = await configuracaoRepo.save(config);
        return toResposta(atualizada);
    }
};

