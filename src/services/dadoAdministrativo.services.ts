import { AppDataSource } from '../database/database';
import { Dado_Administrativo } from '../models/dadoAdministrativo.entity';
import { CriarDadoAdministrativoDTO, AtualizarDadoAdministrativoDTO } from '../dtos/dadoAdministrativo.dto';

const dadoAdministrativoRepo = AppDataSource.getRepository(Dado_Administrativo);

export const DadoAdministrativoService = {

    buscarPorUtente: async (id_utente: number) => {
        return await dadoAdministrativoRepo.findOne({
            where: { utente: { id: id_utente } },
            relations: ['utente']
        });
    },

    buscarPorId: async (id: number) => {
        return await dadoAdministrativoRepo.findOne({
            where: { id },
            relations: ['utente']
        });
    },

    criar: async (id_utente: number, dados: CriarDadoAdministrativoDTO) => {
        const existe = await dadoAdministrativoRepo.findOne({ where: { utente: { id: id_utente } } });
        if (existe) throw new Error('Este utente já possui dados administrativos registados.');

        const dadoAdministrativo = dadoAdministrativoRepo.create({
            morada: dados.morada,
            nif: dados.nif,
            telemovel: dados.telemovel,
            utente: { id: id_utente }
        });

        return await dadoAdministrativoRepo.save(dadoAdministrativo);
    },

    atualizar: async (id: number, dados: AtualizarDadoAdministrativoDTO) => {
        const dado = await dadoAdministrativoRepo.findOne({ where: { id }, relations: ['utente'] });
        if (!dado) return null;

        if (dados.morada !== undefined) {
            dado.morada = dados.morada.trim();
        }
       
        if (dados.telemovel !== undefined) {
            dado.telemovel = dados.telemovel.trim();
        }

        // O save() garante o disparo automático do @UpdateDateColumn
        return await dadoAdministrativoRepo.save(dado);
    },

    eliminar: async (id: number) => {
        const dado = await dadoAdministrativoRepo.findOne({ where: { id } });
        if (!dado) throw new Error('Registo administrativo não encontrado.');
        await dadoAdministrativoRepo.remove(dado);
    }
};