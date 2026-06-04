import { Request, Response } from 'express';
import { HistoriaFamiliarService } from '../services/historiaFamiliar.services';
import { CriarHistoriaFamiliarDTO, AtualizarHistoriaFamiliarDTO } from '../dtos/historiaFamiliar.dto';
import { AppDataSource } from '../database/database';
import { Utente } from '../models/utente.entity';
import { Medico } from '../models/medico.entity';

const utenteRepo = AppDataSource.getRepository(Utente);
const medicoRepo = AppDataSource.getRepository(Medico);

// Função auxiliar centralizada para validação de identidade e escopo clínico
async function validarAcessoFichaUtente(utilizadorLogado: any, idUtenteUrl: number): Promise<{ valido: boolean; erro?: string; status?: number }> {
    if (utilizadorLogado.tipo_utilizador === 'utente') {
        const utenteDados = await utenteRepo.findOne({ 
            where: { utilizador: { id: utilizadorLogado.id } } 
        });

        if (!utenteDados || utenteDados.id !== idUtenteUrl) {
            return { valido: false, erro: 'Acesso negado. Não pode consultar a história familiar de outros utentes.', status: 403 };
        }
    } else if (utilizadorLogado.tipo_utilizador === 'medico') {
        const medicoPerfil = await medicoRepo.findOne({ where: { utilizador: { id: utilizadorLogado.id } } });
        if (!medicoPerfil) {
            return { valido: false, erro: 'Perfil médico não localizado no sistema.', status: 404 };
        }

        const utenteAlvo = await utenteRepo.findOne({
            where: { id: idUtenteUrl },
            relations: ['medico']
        });

        if (!utenteAlvo) {
            return { valido: false, erro: 'Utente não encontrado no sistema.', status: 404 };
        }

        if (!utenteAlvo.medico || utenteAlvo.medico.id !== medicoPerfil.id) {
            return { valido: false, erro: 'Acesso negado. Apenas o médico responsável por este utente pode gerir ou consultar a sua história familiar.', status: 403 };
        }
    }
    return { valido: true };
}

export const HistoriaFamiliarController = {

    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const idUtenteUrl = Number(req.params.id_utente);
            if (isNaN(idUtenteUrl) || idUtenteUrl <= 0) return res.status(400).json({ erro: 'ID do utente na URL inválido.' });

            const controlo = await validarAcessoFichaUtente(req.user!, idUtenteUrl);
            if (!controlo.valido) return res.status(controlo.status!).json({ erro: controlo.erro });

            const historias = await HistoriaFamiliarService.listarPorUtente(idUtenteUrl);
            return res.json(historias);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao listar história familiar do utente' });
        }
    },

    criar: async (req: Request, res: Response) => {
        try {
            const id_utente_alvo = Number(req.params.id_utente);
            if (isNaN(id_utente_alvo) || id_utente_alvo <= 0) return res.status(400).json({ erro: 'ID do utente na URL inválido.' });

            const { nome, descricao } = req.body;
            if (!nome || nome.trim() === '') return res.status(400).json({ erro: 'O nome (grau de parentesco) é obrigatório.' });
            if (!descricao || descricao.trim() === '') return res.status(400).json({ erro: 'A descrição clínica é obrigatória.' });

            const controlo = await validarAcessoFichaUtente(req.user!, id_utente_alvo);
            if (!controlo.valido) return res.status(controlo.status!).json({ erro: controlo.erro });

            const dadosDTO: CriarHistoriaFamiliarDTO = { nome: nome.trim(), descricao: descricao.trim() };
            const historia = await HistoriaFamiliarService.criar(id_utente_alvo, dadosDTO);
            
            return res.status(201).json(historia);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message || 'Erro ao criar registo de história familiar' });
        }
    },

    buscarPorId: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id) || id <= 0) return res.status(400).json({ erro: 'ID do registo inválido.' });

            const historia = await HistoriaFamiliarService.buscarPorId(id);
            if (!historia) return res.status(404).json({ erro: 'Registo de história familiar não encontrado' });

            // BARREIRA DE SEGURANÇA: Bloqueia leituras cruzadas por ID direto da rota
            const controlo = await validarAcessoFichaUtente(req.user!, historia.utente.id);
            if (!controlo.valido) return res.status(controlo.status!).json({ erro: controlo.erro });

            return res.json(historia);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao buscar registo de história familiar' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id) || id <= 0) return res.status(400).json({ erro: 'ID do registo inválido.' });

            const historiaOriginal = await HistoriaFamiliarService.buscarPorId(id);
            if (!historiaOriginal) return res.status(404).json({ erro: 'Registo de história familiar não encontrado' });

            // BARREIRA DE SEGURANÇA: Bloqueia médicos intrusos de editarem registos fora da sua carteira
            const controlo = await validarAcessoFichaUtente(req.user!, historiaOriginal.utente.id);
            if (!controlo.valido) return res.status(controlo.status!).json({ erro: controlo.erro });

            const dadosDTO: AtualizarHistoriaFamiliarDTO = req.body;
            const historia = await HistoriaFamiliarService.atualizar(id, dadosDTO);
            
            return res.json(historia);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao atualizar registo de história familiar' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id) || id <= 0) return res.status(400).json({ erro: 'ID do registo inválido.' });

            const historiaOriginal = await HistoriaFamiliarService.buscarPorId(id);
            if (!historiaOriginal) return res.status(404).json({ erro: 'Registo de história familiar não encontrado' });

            // BARREIRA DE SEGURANÇA: Bloqueia médicos intrusos de removerem registos fora da sua carteira
            const controlo = await validarAcessoFichaUtente(req.user!, historiaOriginal.utente.id);
            if (!controlo.valido) return res.status(controlo.status!).json({ erro: controlo.erro });

            await HistoriaFamiliarService.eliminar(id);
            return res.status(204).send();
        } catch (err: any) {
            return res.status(400).json({ erro: err.message || 'Erro ao eliminar registo de história familiar' });
        }
    }
};