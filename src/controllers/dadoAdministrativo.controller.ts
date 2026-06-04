import { Request, Response } from 'express';
import { DadoAdministrativoService } from '../services/dadoAdministrativo.services';
import { CriarDadoAdministrativoDTO, AtualizarDadoAdministrativoDTO } from '../dtos/dadoAdministrativo.dto';
import { AppDataSource } from '../database/database';
import { Utente } from '../models/utente.entity';

const utenteRepo = AppDataSource.getRepository(Utente);

async function validarPosseRegisto(utilizadorLogado: any, idUtenteAlvo: number): Promise<{ valido: boolean; erro?: string; status?: number }> {
    if (utilizadorLogado.tipo_utilizador === 'utente') {
        const utentePerfil = await utenteRepo.findOne({ where: { utilizador: { id: utilizadorLogado.id } } });
        if (!utentePerfil || utentePerfil.id !== idUtenteAlvo) {
            return { valido: false, erro: 'Acesso negado. Não possui permissões sobre os dados deste utente.', status: 403 };
        }
    }
    return { valido: true };
}

export const DadoAdministrativoController = {

    buscarPorUtente: async (req: Request, res: Response) => {
        try {
            const id_utente = Number(req.params.id_utente);
            if (isNaN(id_utente) || id_utente <= 0) return res.status(400).json({ erro: 'ID de utente inválido.' });

            const controlo = await validarPosseRegisto(req.user!, id_utente);
            if (!controlo.valido) return res.status(controlo.status!).json({ erro: controlo.erro });

            const dado = await DadoAdministrativoService.buscarPorUtente(id_utente);
            if (!dado) return res.status(404).json({ erro: 'Dados administrativos não encontrados.' });
            
            return res.json(dado);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao buscar dados administrativos do utente.' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id) || id <= 0) return res.status(400).json({ erro: 'ID de registo inválido.' });

            const dado = await DadoAdministrativoService.buscarPorId(id);
            if (!dado) return res.status(404).json({ erro: 'Dados administrativos não encontrados.' });

            const controlo = await validarPosseRegisto(req.user!, dado.utente.id);
            if (!controlo.valido) return res.status(controlo.status!).json({ erro: controlo.erro });

            return res.json(dado);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao buscar dados administrativos.' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const id_utente = Number(req.params.id_utente);
            if (isNaN(id_utente) || id_utente <= 0) return res.status(400).json({ erro: 'ID de utente inválido.' });

            const { morada, nif, telemovel } = req.body;
            if (!morada || morada.trim() === '') return res.status(400).json({ erro: 'A morada é obrigatória.' });
            if (!nif) return res.status(400).json({ erro: 'O NIF é obrigatório.' });
            if (!telemovel || telemovel.trim() === '') return res.status(400).json({ erro: 'O telemóvel é obrigatório.' });

            const dadosDTO: CriarDadoAdministrativoDTO = { morada: morada.trim(), nif: Number(nif), telemovel: telemovel.trim() };
            const dado = await DadoAdministrativoService.criar(id_utente, dadosDTO);
            
            return res.status(201).json(dado);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message || 'Erro ao criar registo administrativo.' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id) || id <= 0) return res.status(400).json({ erro: 'ID de registo inválido.' });

            const dadoOriginal = await DadoAdministrativoService.buscarPorId(id);
            if (!dadoOriginal) return res.status(404).json({ erro: 'Dados administrativos não encontrados.' });

            // Garante que o utente logado só altera o seu próprio ID administrativo
            const controlo = await validarPosseRegisto(req.user!, dadoOriginal.utente.id);
            if (!controlo.valido) return res.status(controlo.status!).json({ erro: controlo.erro });

            const dadosDTO: AtualizarDadoAdministrativoDTO = req.body;
            const dadoAtualizado = await DadoAdministrativoService.atualizar(id, dadosDTO);
            
            return res.json(dadoAtualizado);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao atualizar dados administrativos.' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id) || id <= 0) return res.status(400).json({ erro: 'ID de registo inválido.' });

            const dadoOriginal = await DadoAdministrativoService.buscarPorId(id);
            if (!dadoOriginal) return res.status(404).json({ erro: 'Dados administrativos não encontrados.' });

            const controlo = await validarPosseRegisto(req.user!, dadoOriginal.utente.id);
            if (!controlo.valido) return res.status(controlo.status!).json({ erro: controlo.erro });

            await DadoAdministrativoService.eliminar(id);
            return res.status(204).send();
        } catch (err: any) {
            return res.status(400).json({ erro: err.message || 'Erro ao eliminar registo administrativo.' });
        }
    }
};