import express from 'express'
import conexao from './models/conexao.js'
import { fileURLToPath } from 'url'
import path from 'path'
const createHmac = import('node:crypto');
import bcrypt from "bcrypt";



const app = express()
app.use(express.json())

app.use(express.urlencoded({ extended: true }))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(__dirname))


//FUNÇÕES AUXILIARES 
function x() { }


function cripitarSenha(senha) {


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
        if (erro) {
            res.status(500).send('Erro ao efetuar login')
            return
        }

        if (resultados.length > 0) {
            res.status(200).send('Login efetuado com sucesso!')
        } else {
            res.status(401).send('Credenciais inválidas')
        }
    })
})

// ROTAS







////////////////
export default app

