import { TipoExame } from '../models/exame.entity';

export const ExamesSeed = [
    {
        nome_exame: 'Espirometria',
        descricao: 'Avaliação da função pulmonar através da medição dos volumes e fluxos de ar expirados. Essencial para o diagnóstico de Asma.',
        tipo: TipoExame.FUNCIONAL
    },
    {
        nome_exame: 'Pletismografia',
        descricao: 'Prova de função respiratória avançada para medir a capacidade pulmonar total e o volume residual.',
        tipo: TipoExame.FUNCIONAL
    },
    {
        nome_exame: 'Provas de Provocação Inalatória',
        descricao: 'Permitem estudar a reação das vias aéreas a compostos ou situações específicas. Incluem a aplicação de um estímulo (físico ou farmacológico) e a avaliação da resposta através de espirometria.',
        tipo: TipoExame.FUNCIONAL
    },
    {
        nome_exame: 'Teste de Difusão',
        descricao: 'Exame que avalia a capacidade dos pulmões de transferir gases da respiração para a corrente sanguínea.',
        tipo: TipoExame.FUNCIONAL
    },
    {
        nome_exame: 'Teste de Exercício Cardiopulmonar',
        descricao: 'Exame que avalia as trocas gasosas e a funcionalidade alveolar durante o esforço físico.',
        tipo: TipoExame.FUNCIONAL
    },
    {
        nome_exame: 'Radiografia do Tórax',
        descricao: 'Exame de imagem por raio-X para avaliação de estruturas pulmonares, cardíacas e da parede torácica.',
        tipo: TipoExame.IMAGEM
    },
    {
        nome_exame: 'TAC de Alta Resolução do Tórax',
        descricao: 'Tomografia computadorizada detalhada para identificar alterações no parênquima pulmonar e vias aéreas.',
        tipo: TipoExame.IMAGEM
    },
    {
        nome_exame: 'Prick Test (Testes Cutâneos de Alergia)',
        descricao: 'Teste na pele para identificar hipersensibilidade a alergénios aéreos (ácaros, pólens, fungos) relacionados com a Rinite e Asma.',
        tipo: TipoExame.FUNCIONAL
    },
    {
        nome_exame: 'Teste do Óxido Nítrico Exalado (FeNO)',
        descricao: 'Medição do óxido nítrico exalado para avaliar a inflamação das vias aéreas, útil no diagnóstico e monitorização da Asma.',
        tipo: TipoExame.FUNCIONAL
    },
    {
        nome_exame: 'Medição do Pico de Fluxo Expiratório (PFE)',
        descricao: 'Exame que avalia a velocidade máxima com que se consegue expelir o ar dos pulmões.',
        tipo: TipoExame.FUNCIONAL
    },
    {
        nome_exame: 'Prova de Broncoprovocação',
        descricao: 'Teste que avalia a hiperresponsividade das vias aéreas a estímulos específicos, como metacolina ou exercício físico.',
        tipo: TipoExame.FUNCIONAL
    },
    {
        nome_exame: 'Rinoscopia',
        descricao: 'Exame que permite a visualização do interior da narina e da região nasal.',
        tipo: TipoExame.FUNCIONAL
    }
];