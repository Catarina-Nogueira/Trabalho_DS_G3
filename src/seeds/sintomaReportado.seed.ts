import { AppDataSource } from '../database/database';
import { Sintoma_Reportado } from '../models/sintomaReportado.entity';
import { Utente } from '../models/utente.entity';

/**
 * Seed de Sintomas Reportados — RF54
 *
 * DEPENDE de rodarUtilizadoresSeed() ter corrido primeiro.
 *
 * Escala dos campos numéricos (0-3):
 *   nivel_mal_estar_geral  : 0=Nenhum  1=Ligeiro    2=Moderado   3=Grave
 *   sintomas_pulmonares    : 0=Nenhum  1=Ligeiros   2=Moderados  3=Graves
 *   sintomas_nasais        : 0=Nenhum  1=Ligeiros   2=Moderados  3=Graves
 *   interrupcao_sono       : 0=Não     1=Uma vez    2=Várias     3=Noite perturbada
 *   uso_medicacao_resgate  : 0=Não     1=1-2x       2=3-4x       3=Mais de 4x
 *   gatilho_identificavel  : 0=Não     1=Alérgeno   2=Esforço    3=Outro
 */
export const rodarSintomaReportadoSeed = async () => {

    const repo       = AppDataSource.getRepository(Sintoma_Reportado);
    const utenteRepo = AppDataSource.getRepository(Utente);

    const total = await repo.count();
    if (total > 0) {
        console.log('Sintomas reportados já existem. Seed saltada.');
        return;
    }

    // Busca os utentes pela ordem em que foram criados na seed de utilizadores
    const utentes = await utenteRepo.find({
        relations: ['utilizador'],
        order: { id: 'ASC' },
    });

    if (utentes.length === 0) {
        console.log('Sem utentes na base de dados. Corre rodarUtilizadoresSeed() primeiro.');
        return;
    }

    // Helper seguro — se o índice não existir usa o primeiro utente disponível
    const u = (indice: number): Utente => {
        const utente = utentes[indice] ?? utentes[0];
        if (!utente) throw new Error('Sem utentes disponíveis para a seed de sintomas.');
        return utente;
    };

    // Helper para criar datas no passado
    const diasAtras = (dias: number): Date => {
        const d = new Date();
        d.setDate(d.getDate() - dias);
        return d;
    };

    // ─── Registos simulados ────────────────────────────────────────────────────
    // Cada utente tem entre 3 e 5 registos que contam uma evolução clínica coerente

    const registos: Partial<Sintoma_Reportado>[] = [

        // ── João Ferreira (u0) — agravamento seguido de recuperação progressiva ──
        {
            utente:                u(0),
            data_registo:          diasAtras(30),
            nivel_mal_estar_geral: 3,
            sintomas_pulmonares:   3,
            sintomas_nasais:       2,
            interrupcao_sono:      2,
            uso_medicacao_resgate: 3,
            gatilho_identificavel: 1,
            notas_adicionais:      'Crise asmática após visita a casa com animais. Usou Salbutamol 3x.',
        },
        {
            utente:                u(0),
            data_registo:          diasAtras(21),
            nivel_mal_estar_geral: 2,
            sintomas_pulmonares:   2,
            sintomas_nasais:       2,
            interrupcao_sono:      1,
            uso_medicacao_resgate: 2,
            gatilho_identificavel: 1,
            notas_adicionais:      'Melhoria após ajuste de medicação pelo médico.',
        },
        {
            utente:                u(0),
            data_registo:          diasAtras(14),
            nivel_mal_estar_geral: 1,
            sintomas_pulmonares:   1,
            sintomas_nasais:       1,
            interrupcao_sono:      0,
            uso_medicacao_resgate: 1,
            gatilho_identificavel: 0,
            notas_adicionais:      null,
        },
        {
            utente:                u(0),
            data_registo:          diasAtras(7),
            nivel_mal_estar_geral: 0,
            sintomas_pulmonares:   0,
            sintomas_nasais:       1,
            interrupcao_sono:      0,
            uso_medicacao_resgate: 0,
            gatilho_identificavel: 0,
            notas_adicionais:      'Ligeiro nariz entupido de manhã, melhora ao longo do dia.',
        },
        {
            utente:                u(0),
            data_registo:          diasAtras(1),
            nivel_mal_estar_geral: 0,
            sintomas_pulmonares:   0,
            sintomas_nasais:       0,
            interrupcao_sono:      0,
            uso_medicacao_resgate: 0,
            gatilho_identificavel: 0,
            notas_adicionais:      null,
        },

        // ── Maria Costa (u1) — rinite polínica persistente ──
        {
            utente:                u(1),
            data_registo:          diasAtras(28),
            nivel_mal_estar_geral: 2,
            sintomas_pulmonares:   0,
            sintomas_nasais:       3,
            interrupcao_sono:      1,
            uso_medicacao_resgate: 1,
            gatilho_identificavel: 1,
            notas_adicionais:      'Época de pólenes. Espirros e corrimento nasal intenso durante todo o dia.',
        },
        {
            utente:                u(1),
            data_registo:          diasAtras(21),
            nivel_mal_estar_geral: 2,
            sintomas_pulmonares:   0,
            sintomas_nasais:       3,
            interrupcao_sono:      1,
            uso_medicacao_resgate: 1,
            gatilho_identificavel: 1,
            notas_adicionais:      null,
        },
        {
            utente:                u(1),
            data_registo:          diasAtras(14),
            nivel_mal_estar_geral: 1,
            sintomas_pulmonares:   0,
            sintomas_nasais:       2,
            interrupcao_sono:      0,
            uso_medicacao_resgate: 0,
            gatilho_identificavel: 0,
            notas_adicionais:      'Início de spray nasal corticoide. Sintomas a diminuir.',
        },
        {
            utente:                u(1),
            data_registo:          diasAtras(3),
            nivel_mal_estar_geral: 1,
            sintomas_pulmonares:   0,
            sintomas_nasais:       1,
            interrupcao_sono:      0,
            uso_medicacao_resgate: 0,
            gatilho_identificavel: 0,
            notas_adicionais:      null,
        },

        // ── Pedro Oliveira (u2) — asma induzida pelo esforço físico ──
        {
            utente:                u(2),
            data_registo:          diasAtras(20),
            nivel_mal_estar_geral: 1,
            sintomas_pulmonares:   2,
            sintomas_nasais:       0,
            interrupcao_sono:      0,
            uso_medicacao_resgate: 2,
            gatilho_identificavel: 2,
            notas_adicionais:      'Chiadeira e aperto no peito após corrida de 5 km. Resolvido com inalador.',
        },
        {
            utente:                u(2),
            data_registo:          diasAtras(13),
            nivel_mal_estar_geral: 0,
            sintomas_pulmonares:   0,
            sintomas_nasais:       0,
            interrupcao_sono:      0,
            uso_medicacao_resgate: 0,
            gatilho_identificavel: 0,
            notas_adicionais:      'Semana sem exercício intenso. Assintomático.',
        },
        {
            utente:                u(2),
            data_registo:          diasAtras(6),
            nivel_mal_estar_geral: 1,
            sintomas_pulmonares:   2,
            sintomas_nasais:       0,
            interrupcao_sono:      0,
            uso_medicacao_resgate: 1,
            gatilho_identificavel: 2,
            notas_adicionais:      'Jogo de futebol. Sintomas ligeiros, usou inalador preventivamente.',
        },

        // ── Sofia Martins (u3) — utente bem controlada, monitorização de rotina ──
        {
            utente:                u(3),
            data_registo:          diasAtras(25),
            nivel_mal_estar_geral: 0,
            sintomas_pulmonares:   0,
            sintomas_nasais:       0,
            interrupcao_sono:      0,
            uso_medicacao_resgate: 0,
            gatilho_identificavel: 0,
            notas_adicionais:      null,
        },
        {
            utente:                u(3),
            data_registo:          diasAtras(18),
            nivel_mal_estar_geral: 0,
            sintomas_pulmonares:   0,
            sintomas_nasais:       0,
            interrupcao_sono:      0,
            uso_medicacao_resgate: 0,
            gatilho_identificavel: 0,
            notas_adicionais:      null,
        },
        {
            utente:                u(3),
            data_registo:          diasAtras(11),
            nivel_mal_estar_geral: 1,
            sintomas_pulmonares:   0,
            sintomas_nasais:       1,
            interrupcao_sono:      0,
            uso_medicacao_resgate: 0,
            gatilho_identificavel: 3,
            notas_adicionais:      'Visita a casa com gato. Ligeiro nariz entupido passageiro.',
        },
        {
            utente:                u(3),
            data_registo:          diasAtras(2),
            nivel_mal_estar_geral: 0,
            sintomas_pulmonares:   0,
            sintomas_nasais:       0,
            interrupcao_sono:      0,
            uso_medicacao_resgate: 0,
            gatilho_identificavel: 0,
            notas_adicionais:      null,
        },

        // ── Rui Pereira (u4) — agravamento súbito recente (deve gerar alerta) ──
        {
            utente:                u(4),
            data_registo:          diasAtras(10),
            nivel_mal_estar_geral: 1,
            sintomas_pulmonares:   1,
            sintomas_nasais:       1,
            interrupcao_sono:      0,
            uso_medicacao_resgate: 0,
            gatilho_identificavel: 0,
            notas_adicionais:      null,
        },
        {
            utente:                u(4),
            data_registo:          diasAtras(5),
            nivel_mal_estar_geral: 3,
            sintomas_pulmonares:   3,
            sintomas_nasais:       2,
            interrupcao_sono:      3,
            uso_medicacao_resgate: 3,
            gatilho_identificavel: 3,
            notas_adicionais:      'Exposição a fumo durante incêndio próximo. Crise grave — recorreu a urgência.',
        },
        {
            utente:                u(4),
            data_registo:          diasAtras(2),
            nivel_mal_estar_geral: 2,
            sintomas_pulmonares:   2,
            sintomas_nasais:       1,
            interrupcao_sono:      1,
            uso_medicacao_resgate: 2,
            gatilho_identificavel: 0,
            notas_adicionais:      'A recuperar. Corticoterapia oral prescrita pela urgência.',
        },
    ];

    await repo.save(registos);
    console.log(`Seed executada com sucesso! ${registos.length} registos de sintomas adicionados.`);
};