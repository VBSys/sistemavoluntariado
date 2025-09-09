const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost", // ou "127.0.0.1"
  port: 3306, // porta padrão do MySQL
  user: "ap_user", // seu usuário
  password: "Tcc@2025#", // sua senha
  database: "voluntariado_db", // nome correto do banco
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco:", err.message);
  } else {
    console.log("✅ Conectado ao banco de dados MySQL!");
  }
});

module.exports = connection;
