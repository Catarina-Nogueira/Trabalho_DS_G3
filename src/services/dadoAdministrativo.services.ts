import { AppDataSource } from '../database/database';
import { Dado_Administrativo } from '../models/dadoAdministrativo.entity';
import { CriarDadoAdministrativoDTO, AtualizarDadoAdministrativoDTO } from '../dtos/dadoAdministrativo.dto';

const dadoAdministrativoRepo = AppDataSource.getRepository(Dado_Administrativo);

export const DadoAdministrativoService = {

    // RF06 - Consultar dados administrativos de um utente
    buscarPorUtente: async (id_utente: number) => {
        return await dadoAdministrativoRepo.findOne({
            where: { utente: { id: id_utente } },
            relations: ['utente']
        });
    },

    // RF06 - Consultar detalhe de um registo administrativo por id
    buscarPorId: async (id: number) => {
        return await dadoAdministrativoRepo.findOne({
            where: { id },
            relations: ['utente']
        });
    },

    // RF06 - Criar dados administrativos vinculados à URL
    criar: async (id_utente: number, dados: CriarDadoAdministrativoDTO) => {
        // Validar se o utente já tem dados administrativos criados (relação OneToOne)
        const existe = await dadoAdministrativoRepo.findOneBy({ utente: { id: id_utente } });
        if (existe) throw new Error('Este utente já possui dados administrativos registados.');

        const dadoAdministrativo = dadoAdministrativoRepo.create({
            morada: dados.morada,
            nif: dados.nif,
            telemovel: dados.telemovel,
            utente: { id: id_utente }
        });

        return await dadoAdministrativoRepo.save(dadoAdministrativo);
    },

    // RF05 - Atualizar dados administrativos
    atualizar: async (id: number, dados: AtualizarDadoAdministrativoDTO) => {
        const existe = await dadoAdministrativoRepo.findOneBy({ id });
        if (!existe) return null;

        await dadoAdministrativoRepo.update(id, dados);
        return await dadoAdministrativoRepo.findOne({
            where: { id },
            relations: ['utente']
        });
    },

    // Eliminar dados administrativos
    eliminar: async (id: number) => {
        const existe = await dadoAdministrativoRepo.findOneBy({ id });
        if (!existe) throw new Error('Registo administrativo não encontrado.');
        await dadoAdministrativoRepo.delete(id);
    }
};