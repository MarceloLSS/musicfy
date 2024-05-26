import express from 'express'
import conexao from './models/conexao.js'
import { fileURLToPath } from 'url'
import path from 'path'

import bcrypt from "bcrypt";



const app = express()
app.use(express.json())

app.use(express.urlencoded({ extended: true }))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(__dirname))


//FUNÇÕES AUXILIARES 
function x() {



}



//FUNÇÕES AUXILIARES


// ROTAS
app.get('/', (req, res) => {
    res.status(200).send('rodando')
})


app.get('/musicas', (req, res) => {
    const sql = 'SELECT * FROM musicas';
    conexao.query(sql, (error, results) => {
        if (error) {
            console.error('Erro ao recuperar dados:', error);
            res.status(500).send('Erro ao recuperar dados');
            return;
        }

        res.json(results);
    });
});



app.post('/add/musicas', (req, res) => {
    const { NomeMusica, Cifra, LinkMusica } = req.body;

    if (!NomeMusica || !LinkMusica) {
        return res.status(400).send('Nome da Música e Link da Música são obrigatórios');
    }

    const sql = 'INSERT INTO musicas (NomeMusica, Cifra, LinkMusica) VALUES (?, ?, ?)';
    conexao.query(sql, [NomeMusica, Cifra, LinkMusica], (error, results) => {
        if (error) {
            console.error('Erro ao inserir dados:', error);
            res.status(500).send('Erro ao inserir dados');
            return;
        }
        res.status(201).send('Música adicionada com sucesso');
    });
});




//Cadastrar um novo usuario
app.post('/usuarios/cadastrar', (req, res) => {
    const { nomeUsuario, emailUsuario, senhaUsuario } = req.body

    // Primeiro, verifica se o e-mail já existe
    const checkEmailQuery = 'SELECT COUNT(*) AS count FROM usuarios WHERE email = ?'
    conexao.query(checkEmailQuery, [emailUsuario], (erro, resultados) => {
        if (erro) {
            res.status(500).send('Erro ao verificar e-mail')
            return
        }

        if (resultados[0].count > 0) {
            res.status(400).send('Já possui cadastro')
        } else {
            // Se o e-mail não existe, insere o novo usuário
            const insertQuery = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ? )'

            const saltRounds = 10;
            const minhaSenha = senhaUsuario;

            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(minhaSenha, salt);

            conexao.query(insertQuery, [nomeUsuario, emailUsuario, hash], (erro, resultado) => {
                if (erro) {
                    res.status(500).send('Erro ao cadastrar usuário')
                } else {
                    res.status(201).send('Usuário cadastrado com sucesso!')
                }
            })
        }
    })
})

//Efetuar login
app.post('/usuarios/login', (req, res) => {
    const { emailUsuario, senhaUsuario } = req.body

    const loginQuery = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?'

    const saltRounds = 10;
    const minhaSenha = senhaUsuario;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(minhaSenha, salt);

    conexao.query(loginQuery, [emailUsuario, hash], (erro, resultados) => {

        try {
            if (resultados.length > 0) {
                res.status(200).send('Login efetuado com sucesso!')
            } else {
                res.status(401).send('Credenciais inválidas')
            }
        }

        catch (erro) {
            res.status(500).send('Login Invalido')
            return
        }




    })
})

app.post('/playlists', (req, res) => {
    const { nome, usuario_id } = req.body;

    // Verificar se nome e usuario_id foram fornecidos
    if (!nome || !usuario_id) {
        return res.status(400).send({ error: 'Nome e usuario_id são obrigatórios' });
    }

    const sql = 'INSERT INTO playlists (nome, usuario_id) VALUES (?, ?)';
    conexao.query(sql, [nome, usuario_id], (error, results) => {
        if (error) {
            console.error('Erro ao criar playlist:', error);
            res.status(500).send({ error: 'Erro ao criar playlist' });
            return;
        }
        res.status(201).send({ id: results.insertId, nome, usuario_id });
    });
});


// Rota para adicionar uma música a uma playlist. o :playlistId tem que ser passado o numero do id na url
app.post('/playlists/:playlistId/musicas', (req, res) => {
    const { playlistId } = req.params;
    const { musica_id } = req.body;

    // Verificar se musica_id foi fornecido
    if (!musica_id) {
        return res.status(400).send({ error: 'musica_id é obrigatório' });
    }

    const sql = 'INSERT INTO playlist_musicas (playlist_id, musica_id) VALUES (?, ?)';
    conexao.query(sql, [playlistId, musica_id], (error, results) => {
        if (error) {
            console.error('Erro ao adicionar música à playlist:', error);
            return res.status(500).send({ error: 'Erro ao adicionar música à playlist' });
        }
        res.status(201).send({ message: 'Música adicionada à playlist com sucesso' });
    });
});


// Rota para listar todas as músicas de uma playlist. o :playlistId tem que ser passado o numero do id na url
app.get('/playlists/:playlistId/musicas', (req, res) => {
    const { playlistId } = req.params;

    const sql = `
      SELECT m.*
      FROM musicas m
      JOIN playlist_musicas pm ON m.id = pm.musica_id
      WHERE pm.playlist_id = ?
    `;

    conexao.query(sql, [playlistId], (error, results) => {
        if (error) {
            console.error('Erro ao recuperar músicas da playlist:', error);
            return res.status(500).send('Erro ao recuperar músicas da playlist');
        }
        res.json(results);
    });
});




// Rota para listar todas as playlists de um usuário. o :usuarioId tem que ser passado como parametro na url.
app.get('/usuarios/:usuarioId/playlists', (req, res) => {
    const { usuarioId } = req.params;

    const sql = 'SELECT * FROM playlists WHERE usuario_id = ?';
    conexao.query(sql, [usuarioId], (error, results) => {
        if (error) {
            console.error('Erro ao recuperar playlists do usuário:', error);
            return res.status(500).send('Erro ao recuperar playlists do usuário');
        }
        res.json(results);
    });
});

// ROTAS







////////////////
export default app

