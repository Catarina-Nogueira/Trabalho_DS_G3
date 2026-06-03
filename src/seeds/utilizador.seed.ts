import { AppDataSource } from '../database/database';
import { Utilizador, Tipo_Utilizador, Estado } from '../models/utilizador.entity';
import { Administrador } from '../models/administrador.entity';
import { Medico } from '../models/medico.entity';
import { Utente, Sexo_Biologico } from '../models/utente.entity';
import bcrypt from 'bcryptjs';

export const rodarUtilizadoresSeed = async () => {
    const utilizadorRepo = AppDataSource.getRepository(Utilizador);
    const adminRepo = AppDataSource.getRepository(Administrador);
    const medicoRepo = AppDataSource.getRepository(Medico);
    const utenteRepo = AppDataSource.getRepository(Utente);

    const totalUtilizadores = await utilizadorRepo.count();
    if (totalUtilizadores > 0) {
        console.log('Utilizadores já existem na base de dados. Seed saltada.');
        return;
    }

    console.log('A iniciar a seed com passwords personalizadas...');

    //Seed de administradores
    const dadosAdmins = [
        { username: 'admin_carlos', email: 'carlos.admin@sistema.com', nome: 'Carlos Pereria' },
        { username: 'admin_ana', email: 'ana.admin@sistema.com', nome: 'Ana Gomes' }
    ];

    for (const dado of dadosAdmins) {
        //password:username123
        const passwordTextoLimpo = `${dado.username}123`;
        const passwordHashed = await bcrypt.hash(passwordTextoLimpo, 10);

        const userAdmin = utilizadorRepo.create({
            username: dado.username,
            password: passwordHashed,
            email: dado.email,
            tipo_utilizador: Tipo_Utilizador.ADMINISTRADOR,
            estado: Estado.ATIVO
        });
        const adminUserSalvo = await utilizadorRepo.save(userAdmin);

        const perfilAdmin = adminRepo.create({
            utilizador: adminUserSalvo,
            nome: dado.nome
        });
        await adminRepo.save(perfilAdmin);
    }

    // Médicos
    const dadosMedicos = [
        { username: 'dr_silva', email: 'dr.silva@hospital.com', nome: 'António Silva', especialidade: 'Imunoalergologia', numero_medico: 19345, telemovel: '912345678' },
        { username: 'dra_santos', email: 'dra.santos@hospital.com', nome: 'Beatriz Santos', especialidade: 'Pneumologia', numero_medico: 67890, telemovel: '923456789' },
        { username: 'dr_costa', email: 'dr.costa@hospital.com', nome: 'Ricardo Costa', especialidade: 'Pediatria', numero_medico: 54321, telemovel: '934567890' }
    ];

    const medicosCriados: Medico[] = [];

    for (const dado of dadosMedicos) {
        //password: "username123"
        const passwordTextoLimpo = `${dado.username}123`;
        const passwordHashed = await bcrypt.hash(passwordTextoLimpo, 10);

        const userMedico = utilizadorRepo.create({
            username: dado.username,
            password: passwordHashed,
            email: dado.email,
            tipo_utilizador: Tipo_Utilizador.MEDICO,
            estado: Estado.ATIVO
        });
        const medicoUserSalvo = await utilizadorRepo.save(userMedico);

        const perfilMedico = medicoRepo.create({
            utilizador: medicoUserSalvo,
            nome: dado.nome,
            especialidade: dado.especialidade,
            numero_medico: dado.numero_medico,
            telemovel: dado.telemovel
        });
        const medicoFinal = await medicoRepo.save(perfilMedico);
        medicosCriados.push(medicoFinal);
    }

    // Utentes
    const dadosUtentes = [
        { username: 'joao_ferreira', email: 'joao.ferreira@teste.com', nome: 'João Ferreira', data_nascimento: '2010-05-15', sexo_biologico: Sexo_Biologico.MASCULINO, medicoIndex: 2 },
        { username: 'maria_costa', email: 'maria.costa@teste.com', nome: 'Maria Costa', data_nascimento: '1988-11-23', sexo_biologico: Sexo_Biologico.FEMININO, medicoIndex: 0 },
        { username: 'pedro_oliveira', email: 'pedro.oliveira@teste.com', nome: 'Pedro Oliveira', data_nascimento: '1995-02-02', sexo_biologico: Sexo_Biologico.MASCULINO, medicoIndex: 1 },
        { username: 'sofia_martins', email: 'sofia.martins@teste.com', nome: 'Sofia Martins', data_nascimento: '2001-07-19', sexo_biologico: Sexo_Biologico.FEMININO, medicoIndex: 1 },
        { username: 'rui_pereira', email: 'rui.pereira@teste.com', nome: 'Rui Pereira', data_nascimento: '1968-12-30', sexo_biologico: Sexo_Biologico.MASCULINO, medicoIndex: 2 }
    ];

    for (const dado of dadosUtentes) {
              
        // Passord: username123"
        const passwordTextoLimpo = `utente_${dado.username}123`;
        const passwordHashed = await bcrypt.hash(passwordTextoLimpo, 10);

        const userUtente = utilizadorRepo.create({
            username: dado.username,
            password: passwordHashed,
            email: dado.email,
            tipo_utilizador: Tipo_Utilizador.UTENTE,
            estado: Estado.ATIVO
        });
        const utenteUserSalvo = await utilizadorRepo.save(userUtente);

        const medicoAssociado = medicosCriados[dado.medicoIndex]!;

        const perfilUtente = utenteRepo.create({
            utilizador: utenteUserSalvo,
            medico: medicoAssociado,
            nome: dado.nome,
            data_nascimento: dado.data_nascimento,
            sexo_biologico: dado.sexo_biologico
        });
        await utenteRepo.save(perfilUtente);
    }

    console.log('Seed finalizada com passwords dinâmicas e seguras!');
};