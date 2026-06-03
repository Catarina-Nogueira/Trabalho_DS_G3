import { AppDataSource } from '../database/database';
import { Questionario_Carat } from '../models/questionarioCarat.entity';

export const QuestionarioCaratSeed = async () => {
    const questionarioRepo = AppDataSource.getRepository(Questionario_Carat);

    const jáExiste = await questionarioRepo.findOne({ where: { versao: 'V1_2026' } });
    if (jáExiste) {
        console.log('Questionário V1_2026 já se encontra semeado. Seed saltada.');
        return;
    }

    const dataHoje: string = new Date().toISOString().split('T')[0] || '';

    const opcoesPadraoFrequencia = [
        { texto_opcao: 'Nunca', score: 3 },
        { texto_opcao: 'Até 1 ou 2 dias', score: 2 },
        { texto_opcao: 'Mais de 2 dias por semana', score: 1 },
        { texto_opcao: 'Quase todos os dias ou todos os dias', score: 0 }
    ];

    const questionario = questionarioRepo.create({
        versao: 'V1_2026',
        data_ativacao: dataHoje,
        data_desativacao: null,
        questoes: [
            {
                texto_questao: ' Nariz entupido?',
                opcoes: opcoesPadraoFrequencia
            },
            {
                texto_questao: 'Espirros?',
                opcoes: opcoesPadraoFrequencia
            },
            {
                texto_questao: 'Comichão no nariz?',
                opcoes: opcoesPadraoFrequencia
            },
            {
                texto_questao: 'Corrimento / pingo do nariz?',
                opcoes: opcoesPadraoFrequencia
            },
            {
                texto_questao: 'Falta de ar / dispneia?',
                opcoes: opcoesPadraoFrequencia
            },
            {
                texto_questao: 'Chiadeira no peito / pieira?',
                opcoes: opcoesPadraoFrequencia
            },
            {
                texto_questao: 'Aperto no peito com esforço físico?',
                opcoes: opcoesPadraoFrequencia
            },
            {
                texto_questao: 'Cansaço/dificuldade em fazer as atividades ou tarefas do dia-a-dia?',
                opcoes: opcoesPadraoFrequencia
            },
            {
                texto_questao: 'Acordou durante a noite por causa da sua asma / rinite / alergia?',
                opcoes: opcoesPadraoFrequencia
            },
            {
                texto_questao: 'Na últimas 4 semanas teve que aumentar a utilização dos seus medicamentos?',
                opcoes: [
                    { texto_opcao: 'Não estou a tomar medicamentos', score: 0 },
                    { texto_opcao: 'Nunca', score: 1 },
                    { texto_opcao: 'Menos de 7 dias', score: 2 },
                    { texto_opcao: '7 dias ou mais', score: 3 }
                ]
            }
            
        ]
    });
    await questionarioRepo.save(questionario);
    console.log('V1_2026 semeado com sucesso (Questionário, Questões e Opções inseridos)!');
};
