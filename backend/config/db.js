// config/db.js
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost", // ou 127.0.0.1
  user: "ap_user", // ou outro usuário definido
  password: "Tcc@2025#", // senha do banco
  database: "voluntariado_db", // nome do banco criado
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco:", err);
  } else {
    console.log("Conectado ao banco de dados MySQL!");
  }
});

module.exports = connection;
