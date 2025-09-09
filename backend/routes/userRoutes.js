const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 📌 Rota para cadastrar usuário
router.post("/", (req, res) => {
  const { nome, email, senha, sobre_mim, tipo_usuario } = req.body;

  // Verifica se todos os campos obrigatórios foram enviados
  if (!nome || !email || !senha || !tipo_usuario) {
    return res.status(400).json({
      erro: "Campos obrigatórios ausentes",
      detalhes: "nome, email, senha e tipo_usuario são obrigatórios",
    });
  }

  const query = `
    INSERT INTO usuarios (nome, email, senha, sobre_mim, tipo_usuario)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [nome, email, senha, sobre_mim || null, tipo_usuario],
    (err, result) => {
      if (err) {
        console.error("❌ Erro MySQL:", err.message);
        return res.status(500).json({
          erro: "Erro ao criar usuário",
          detalhes: err.message,
        });
      }

      res.status(201).json({
        mensagem: "Usuário cadastrado com sucesso",
        id: result.insertId,
      });
    }
  );
});

// 📌 Rota para listar todos os usuários
router.get("/", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) {
      console.error("❌ Erro MySQL:", err.message);
      return res.status(500).json({
        erro: "Erro ao buscar usuários",
        detalhes: err.message,
      });
    }

    res.json(results);
  });
});

module.exports = router;
