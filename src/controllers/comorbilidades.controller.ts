import { Request, Response } from 'express';
import { ComorbilidadeService } from '../services/comorbilidades.service';
import { CriarComorbilidadeDTO, AtualizarComorbilidadeDTO } from '../dtos/comorbilidade.dto';

export const ComorbilidadeController = {

    // POST /utentes/:id_utente/comorbilidades
    criar: async (req: Request, res: Response) => {
        try {
            // Captura o ID do utente diretamente da URL
            const id_utente = Number(req.params.id_utente);
            const { nome, descricao } = req.body;

            if (!id_utente) return res.status(400).json({ erro: 'O parâmetro id_utente na URL é obrigatório.' });
            if (!nome) return res.status(400).json({ erro: 'O nome da comorbilidade é obrigatório.' });
            if (!descricao) return res.status(400).json({ erro: 'A descrição da comorbilidade é obrigatória.' });

            const dadosDTO: CriarComorbilidadeDTO = { nome, descricao };
            
            // Passamos o ID da URL e os dados do Body separadamente para o serviço
            const comorbilidade = await ComorbilidadeService.criar(id_utente, dadosDTO);
            return res.status(201).json(comorbilidade);
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    },

    // Os restantes métodos (listarPorUtente, atualizar, eliminar) mantêm-se iguais...
    listarPorUtente: async (req: Request, res: Response) => {
        try {
            const comorbilidades = await ComorbilidadeService.listarPorUtente(Number(req.params.id_utente));
            return res.json(comorbilidades);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao listar comorbilidades do utente' });
        }
    },

    atualizar: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const dadosDTO: AtualizarComorbilidadeDTO = req.body;
            const comorbilidade = await ComorbilidadeService.atualizar(id, dadosDTO);
            if (!comorbilidade) return res.status(404).json({ erro: 'Comorbilidade não encontrada' });
            return res.json(comorbilidade);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao atualizar comorbilidade' });
        }
    },

    eliminar: async (req: Request, res: Response) => {
        try {
            await ComorbilidadeService.eliminar(Number(req.params.id));
            return res.status(204).send();
        } catch (err: any) {
            return res.status(400).json({ erro: err.message });
        }
    }
};