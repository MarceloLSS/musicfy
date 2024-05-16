import express from 'express'
import conexao from '../infra/conexao.js'
const app = express()
// Ler body com json
app.use(express.json())


//FUNÇÕES AUXILIARES 

function filtrarPorID () {}

//FUNÇÕES AUXILIARES


// ROTAS

//Cadastrar um novo usuario
app.post('/usuarios/cadastrar', (req, res) => {
    const { nomeUsuario, emailUsuario, senhaUsuario, categoriaMusical } = req.body
    const query = 'INSERT INTO usuarios (nomeUsuario, emailUsuario, senhaUsuario, categoriaMusical) VALUES (?, ?, ?, ?)'
    conexao.query(query, [nomeUsuario, emailUsuario, senhaUsuario, categoriaMusical], (erro, resultado) => {
        if (erro){
            res.json({ error: 'Erro ao cadastrar usuário' });
            
        } else res.status(201).json(resultado)
    })
})

// ROTAS







////////////////
export default app


