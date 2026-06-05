import { Request, Response } from 'express';
import { ComorbilidadeService } from '../services/comorbilidades.service';
import { CriarComorbilidadeDTO, AtualizarComorbilidadeDTO } from '../dtos/comorbilidade.dto';
import { AppDataSource } from '../database/database';
import { Utente } from '../models/utente.entity';
import { Medico } from '../models/medico.entity';

const utenteRepo = AppDataSource.getRepository(Utente);
const medicoRepo = AppDataSource.getRepository(Medico);

// Função auxiliar centralizada para validação de posse e escopo clínico
async function validarAcessoFichaUtente(utilizadorLogado: any, idUtenteUrl: number): Promise<{ valido: boolean; erro?: string; status?: number; idMedicoReal?: number }> {
    if (utilizadorLogado.tipo_utilizador === 'utente') {
        const utenteDados = await utenteRepo.findOne({ 
            where: { utilizador: { id: utilizadorLogado.id } } 
        });

        if (!utenteDados || utenteDados.id !== idUtenteUrl) {
            return { valido: false, erro: 'Acesso negado. Não pode gerir comorbilidades de outros utentes.', status: 403 };
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
            return { valido: false, erro: 'Acesso negado. Apenas o médico responsável por este utente pode gerir estas comorbilidades.', status: 403 };
        }

        return { valido: true, idMedicoReal: medicoPerfil.id };
    }
    return { valido: true };
}

export const ComorbilidadeController = {

    criar: async (req: Request, res: Response) => {
        try {
            const id_utente_alvo = Number(req.params.id_utente);
            if (isNaN(id_utente_alvo) || id_utente_alvo <= 0) return res.status(400).json({ erro: 'ID do utente na URL inválido.' });

            const { nome, descricao } = req.body;
            if (!nome || nome.trim() === '') return res.status(400).json({ erro: 'O nome da comorbilidade é obrigatório.' });
            if (!descricao || descricao.trim() === '') return res.status(400).json({ erro: 'A descrição da comorbilidade é obrigatória.' });

            const controlo = await validarAcessoFichaUtente(req.user!, id_utente_alvo);
            if (!controlo.valido) return res.status(controlo.status!).json({ erro: controlo.erro });

            const dadosDTO: CriarComorbilidadeDTO = { nome: nome.trim(), descricao: descricao.trim() };
            const comorbilidade = await ComorbilidadeService.criar(id_utente_alvo, dadosDTO, req.user!.id);
            
            return res.status(201).json(comorbilidade);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao criar comorbilidade' });
        }
    },

    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const idUtenteUrl = Number(req.params.id_utente);
            if (isNaN(idUtenteUrl) || idUtenteUrl <= 0) return res.status(400).json({ erro: 'ID do utente na URL inválido.' });

            const controlo = await validarAcessoFichaUtente(req.user!, idUtenteUrl);
            if (!controlo.valido) return res.status(controlo.status!).json({ erro: controlo.erro });

            const comorbilidades = await ComorbilidadeService.listarPorUtente(idUtenteUrl);
            return res.json(comorbilidades);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao listar comorbilidades do utente.' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id) || id <= 0) return res.status(400).json({ erro: 'ID da comorbilidade inválido.' });

            const comorbilidadeOriginal = await ComorbilidadeService.buscarPorId(id);
            if (!comorbilidadeOriginal) return res.status(404).json({ erro: 'Comorbilidade não encontrada.' });

            // BARREIRA DE SEGURANÇA: Garante integridade na edição
            const controlo = await validarAcessoFichaUtente(req.user!, comorbilidadeOriginal.utente.id);
            if (!controlo.valido) return res.status(controlo.status!).json({ erro: controlo.erro });

            const dadosDTO: AtualizarComorbilidadeDTO = req.body;
            const comorbilidade = await ComorbilidadeService.atualizar(id, dadosDTO, req.user!.id);
            
            return res.json(comorbilidade);
        } catch (err: any) {
            return res.status(500).json({ erro: err.message || 'Erro ao atualizar comorbilidade' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id) || id <= 0) return res.status(400).json({ erro: 'ID da comorbilidade inválido.' });

            const comorbilidadeOriginal = await ComorbilidadeService.buscarPorId(id);
            if (!comorbilidadeOriginal) return res.status(404).json({ erro: 'Comorbilidade não encontrada.' });

            // BARREIRA DE SEGURANÇA: Garante integridade na eliminação
            const controlo = await validarAcessoFichaUtente(req.user!, comorbilidadeOriginal.utente.id);
            if (!controlo.valido) return res.status(controlo.status!).json({ erro: controlo.erro });

            await ComorbilidadeService.eliminar(id, req.user!.id);
            return res.status(204).send();
        } catch (err: any) {
            return res.status(400).json({ erro: err.message || 'Erro ao eliminar comorbilidade' });
        }
    }
};