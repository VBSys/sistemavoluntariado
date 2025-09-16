const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Rota para cadastrar usuário
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

//  Rota para listar todos os usuários
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

// Rota para buscar usuário por ID
router.get("/:id", (req, res) => {
  const userId = req.params.id; // Pega o ID passado na URL

  // Consulta no banco de dados para buscar o usuário pelo ID
  db.query("SELECT * FROM usuarios WHERE id = ?", [userId], (err, results) => {
    if (err) {
      // Loga o erro no console e retorna resposta de erro ao cliente
      console.error("❌ Erro MySQL:", err.message);
      return res.status(500).json({
        erro: "Erro ao buscar usuário",
        detalhes: err.message,
      });
    }

    if (results.length === 0) {
      // Caso nenhum usuário seja encontrado
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    // Retorna o usuário encontrado em formato JSON
    res.json(results[0]);
  });
});

// Rota para remover usuário por ID
router.delete("/:id", (req, res) => {
  const userId = req.params.id; // Pega o ID do usuário passado na URL

  // Executa a consulta para deletar o usuário no banco de dados
  db.query("DELETE FROM usuarios WHERE id = ?", [userId], (err, results) => {
    if (err) {
      // Loga o erro no console e retorna resposta de erro ao cliente
      console.error("❌ Erro MySQL:", err.message);
      return res.status(500).json({
        erro: "Erro ao remover usuário",
        detalhes: err.message,
      });
    }

    if (results.affectedRows === 0) {
      // Caso nenhum usuário seja deletado (ID não encontrado)
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    // Retorna mensagem de sucesso
    res.json({ mensagem: "Usuário removido com sucesso!" });
  });
});
module.exports = router;
