import { AppDataSource } from '../database/database';
import { Permissao } from '../models/permissao.entity';

export const rodarPermissaoSeed = async () => {

    const repo = AppDataSource.getRepository(Permissao);

    const total = await repo.count();
    if (total > 0) {
        console.log('Catálogo de permissões já contém dados. Seed saltada.');
        return;
    }

    const permissoes = [

        // ── Autenticação ──────────────────────────────────────────────────────
        { designacao: 'autenticacao:login',           descricao: 'Permite autenticar no sistema e obter token de acesso.' },
        { designacao: 'autenticacao:logout',          descricao: 'Permite terminar a sessão ativa.' },
        { designacao: 'autenticacao:alterar_password',descricao: 'Permite alterar a própria password.' },

        // ── Utilizadores ──────────────────────────────────────────────────────
        { designacao: 'utilizadores:listar',   descricao: 'Permite listar todos os utilizadores registados.' },
        { designacao: 'utilizadores:ver',      descricao: 'Permite consultar os detalhes de um utilizador.' },
        { designacao: 'utilizadores:criar',    descricao: 'Permite criar novos utilizadores.' },
        { designacao: 'utilizadores:editar',   descricao: 'Permite editar os dados de um utilizador.' },
        { designacao: 'utilizadores:desativar',descricao: 'Permite desativar a conta de um utilizador sem eliminar os seus dados (RF08).' },

        // ── Utentes ───────────────────────────────────────────────────────────
        { designacao: 'utentes:listar',  descricao: 'Permite listar utentes. O médico vê apenas os seus; o admin vê todos.' },
        { designacao: 'utentes:ver',     descricao: 'Permite consultar o perfil clínico e administrativo de um utente.' },
        { designacao: 'utentes:criar',   descricao: 'Permite registar um novo utente no sistema.' },
        { designacao: 'utentes:editar',  descricao: 'Permite editar os dados pessoais e clínicos de um utente.' },
        { designacao: 'utentes:eliminar',descricao: 'Permite eliminar o registo de um utente.' },

        // ── Médicos ───────────────────────────────────────────────────────────
        { designacao: 'medicos:listar',  descricao: 'Permite listar todos os médicos.' },
        { designacao: 'medicos:ver',     descricao: 'Permite consultar o perfil de um médico.' },
        { designacao: 'medicos:criar',   descricao: 'Permite registar um novo médico.' },
        { designacao: 'medicos:editar',  descricao: 'Permite editar os dados de um médico.' },
        { designacao: 'medicos:eliminar',descricao: 'Permite eliminar o registo de um médico.' },

        // ── Módulo CARAT (RF16–RF24) ──────────────────────────────────────────
        { designacao: 'carat:ver_questionario',   descricao: 'Permite obter o questionário CARAT ativo com todas as questões e opções (RF16).' },
        { designacao: 'carat:submeter_respostas', descricao: 'Permite submeter respostas ao questionário CARAT e criar uma avaliação (RF17).' },
        { designacao: 'carat:ver_historico',      descricao: 'Permite consultar o histórico de avaliações CARAT do próprio utente (RF22).' },
        { designacao: 'carat:ver_historico_utente',descricao: 'Permite ao médico consultar o histórico CARAT dos seus utentes (RF23).' },
        { designacao: 'carat:gerir_questionario', descricao: 'Permite ao administrador criar, editar ou desativar versões do questionário CARAT (RF24).' },

        // ── Recomendações (RF25–RF28) ─────────────────────────────────────────
        { designacao: 'recomendacoes:ver_proprias', descricao: 'Permite ao utente consultar as suas recomendações clínicas (RF27).' },
        { designacao: 'recomendacoes:ver_utente',   descricao: 'Permite ao médico consultar as recomendações dos seus utentes (RF28).' },

        // ── Alertas (RF29–RF38) ───────────────────────────────────────────────
        { designacao: 'alertas:ver_proprios',    descricao: 'Permite ao utente consultar os seus alertas (RF38).' },
        { designacao: 'alertas:ver_medico',      descricao: 'Permite ao médico listar e filtrar os alertas dos seus utentes (RF36).' },
        { designacao: 'alertas:atualizar_estado',descricao: 'Permite ao médico atualizar o estado de um alerta (RF34).' },

        // ── Sintomas Reportados (RF54–RF55) ───────────────────────────────────
        { designacao: 'sintomas:registar',       descricao: 'Permite ao utente registar um novo reporte de sintomas (RF54).' },
        { designacao: 'sintomas:ver_historico',  descricao: 'Permite ao médico consultar o histórico de sintomas dos seus utentes (RF55).' },
        { designacao: 'sintomas:ver_proprios',   descricao: 'Permite ao utente consultar os seus próprios registos de sintomas.' },

        // ── Medicação — catálogo (RF43–RF45) ─────────────────────────────────
        { designacao: 'medicacao:listar',  descricao: 'Permite listar o catálogo de medicamentos.' },
        { designacao: 'medicacao:ver',     descricao: 'Permite consultar os detalhes de um medicamento do catálogo.' },
        { designacao: 'medicacao:criar',   descricao: 'Permite adicionar um medicamento ao catálogo.' },
        { designacao: 'medicacao:editar',  descricao: 'Permite editar um medicamento do catálogo.' },
        { designacao: 'medicacao:eliminar',descricao: 'Permite remover um medicamento do catálogo.' },

        // ── Medicação do Utente ───────────────────────────────────────────────
        { designacao: 'medicacao_utente:listar',    descricao: 'Permite ao utente ou médico ver prescrições ativas e históricas (RF45).' },
        { designacao: 'medicacao_utente:prescrever', descricao: 'Permite ao médico prescrever medicação a um utente (RF43).' },
        { designacao: 'medicacao_utente:encerrar',   descricao: 'Permite ao médico encerrar uma prescrição ativa (RF44).' },

        // ── Exames — catálogo ─────────────────────────────────────────────────
        { designacao: 'exames:listar',  descricao: 'Permite listar o catálogo de exames disponíveis.' },
        { designacao: 'exames:ver',     descricao: 'Permite consultar os detalhes de um exame do catálogo.' },
        { designacao: 'exames:criar',   descricao: 'Permite adicionar um exame ao catálogo.' },
        { designacao: 'exames:editar',  descricao: 'Permite editar um exame do catálogo.' },
        { designacao: 'exames:eliminar',descricao: 'Permite remover um exame do catálogo.' },

        // ── Exames do Utente (RF46–RF48) ──────────────────────────────────────
        { designacao: 'exames_utente:listar',          descricao: 'Permite listar os exames de um utente (RF48).' },
        { designacao: 'exames_utente:requisitar',      descricao: 'Permite ao médico requisitar um exame para um utente (RF46).' },
        { designacao: 'exames_utente:registar_resultado',descricao: 'Permite ao médico registar o resultado de um exame (RF47).' },
        { designacao: 'exames_utente:eliminar',        descricao: 'Permite eliminar o registo de um exame de um utente.' },

        // ── Plano de Acompanhamento (RF49) ────────────────────────────────────
        { designacao: 'plano:listar', descricao: 'Permite listar planos de acompanhamento de um utente.' },
        { designacao: 'plano:criar',  descricao: 'Permite ao médico criar um plano de acompanhamento (RF49).' },
        { designacao: 'plano:editar', descricao: 'Permite ao médico editar um plano de acompanhamento.' },

        // ── Dados Clínicos Complementares (RF52–RF53) ─────────────────────────
        { designacao: 'historia_familiar:ver',   descricao: 'Permite consultar a história familiar de um utente (RF52).' },
        { designacao: 'historia_familiar:editar',descricao: 'Permite editar a história familiar de um utente (RF52).' },
        { designacao: 'comorbilidades:listar',   descricao: 'Permite listar as comorbilidades de um utente (RF53).' },
        { designacao: 'comorbilidades:editar',   descricao: 'Permite adicionar ou remover comorbilidades de um utente (RF53).' },

        // ── Dados Administrativos (RF05–RF06) ─────────────────────────────────
        { designacao: 'dados_administrativos:ver',   descricao: 'Permite ao utente consultar os seus dados administrativos (RF05).' },
        { designacao: 'dados_administrativos:editar',descricao: 'Permite ao utente ou admin editar dados administrativos (RF05).' },

        // ── Configuração do Sistema (RF11–RF13) ───────────────────────────────
        { designacao: 'configuracao:ver',   descricao: 'Permite consultar os parâmetros de configuração do sistema (RF11).' },
        { designacao: 'configuracao:editar',descricao: 'Permite ao administrador editar limiares e parâmetros (RF11–RF13).' },

        // ── Permissões (RF10) ─────────────────────────────────────────────────
        { designacao: 'permissoes:listar',  descricao: 'Permite listar todas as permissões definidas no sistema.' },
        { designacao: 'permissoes:atribuir',descricao: 'Permite atribuir permissões a um utilizador (RF10).' },
        { designacao: 'permissoes:revogar', descricao: 'Permite revogar permissões de um utilizador (RF10).' },

        // ── Auditoria (RF56–RF58) ─────────────────────────────────────────────
        { designacao: 'auditoria:listar',  descricao: 'Permite ao administrador listar e filtrar logs de auditoria (RF57).' },
        { designacao: 'auditoria:exportar',descricao: 'Permite ao administrador exportar logs de auditoria (RF58).' },

        // ── Dados Simulados (RF14–RF15) ───────────────────────────────────────
        { designacao: 'dados_simulados:gerir',descricao: 'Permite ao administrador importar e gerir dados simulados (RF14–RF15).' },

        // ── Dashboard (RF39–RF41) ─────────────────────────────────────────────
        { designacao: 'dashboard:ver',descricao: 'Permite ao utente consultar o seu dashboard com gráficos e alertas ativos (RF39–RF41).' },
    ];

    await repo.save(permissoes);
    console.log(`Seed executada com sucesso! ${permissoes.length} permissões adicionadas ao catálogo.`);
};