const mysql = require("mysql2/promise");

require("dotenv").config();

const connection = mysql.createPool({
    host : process.env.MYSQL_HOST,
    user : process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE
}
);



conexao.connect(erro => {
    if (erro) {
        console.error('Erro ao conectar ao banco de dados:', erro);
        return;
    }
    console.log('Conexão ao banco de dados MySQL estabelecida');
})

module.exports = connection;
