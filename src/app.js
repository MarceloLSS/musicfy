import express from 'express'
import cors from 'cors'
import conexao from '../infra/conexao.js'
import { fileURLToPath } from 'url' 
import path from 'path' 

const app = express()
app.use(cors())
app.use(express.json())

app.use(express.urlencoded({ extended: true }))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(__dirname))


//FUNÇÕES AUXILIARES 
function x (){}
//FUNÇÕES AUXILIARES


// ROTAS

//Cadastrar um novo usuario
app.post('/usuarios/cadastrar',  (req, res) => {
    const { nomeUsuario, emailUsuario, senhaUsuario, categoriaMusical } = req.body

    // Primeiro, verifica se o e-mail já existe
    const checkEmailQuery = 'SELECT COUNT(*) AS count FROM usuarios WHERE emailUsuario = ?'
    conexao.query(checkEmailQuery, [emailUsuario], (erro, resultados) => {
        if (erro) {
            res.status(500).send('Erro ao verificar e-mail')
            return
        }

        if (resultados[0].count > 0) {
            res.status(400).send('Já possui cadastro')
        } else {
            // Se o e-mail não existe, insere o novo usuário
            const insertQuery = 'INSERT INTO usuarios (nomeUsuario, emailUsuario, senhaUsuario, categoriaMusical) VALUES (?, ?, ?, ?)'
            conexao.query(insertQuery, [nomeUsuario, emailUsuario, senhaUsuario, categoriaMusical], (erro, resultado) => {
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

    const loginQuery = 'SELECT * FROM usuarios WHERE emailUsuario = ? AND senhaUsuario = ?'
    conexao.query(loginQuery, [emailUsuario, senhaUsuario], (erro, resultados) => {
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


