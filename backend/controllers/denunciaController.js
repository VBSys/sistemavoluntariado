const db = require("../config/db");

// Criar denúncia (POST /denuncias)
exports.criarDenuncia = (req, res) => {
  const {
    id_usuario, // quem está denunciando
    id_evento, // evento relacionado (opcional)
    motivo,
    descricao,
    status = "pendente", // valor padrão
    email_denunciado, // quem está sendo denunciado
  } = req.body;

  if (!id_usuario || !motivo || !email_denunciado) {
    return res.status(400).json({
      erro: "Campos obrigatórios ausentes",
      detalhes: "id_usuario, motivo e email_denunciado são obrigatórios",
    });
  }

  const query = `
    INSERT INTO denuncias (id_usuario, id_evento, motivo, descricao, status, email_denunciado)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      id_usuario,
      id_evento || null,
      motivo,
      descricao || null,
      status,
      email_denunciado,
    ],
    (err, result) => {
      if (err) {
        console.error("Erro ao salvar denúncia:", err);
        return res
          .status(500)
          .json({ erro: "Erro interno ao criar denúncia." });
      }

      res.status(201).json({
        mensagem: "Denúncia registrada com sucesso",
        id: result.insertId,
      });
    }
  );
};
// Listar todas as denúncias (GET /denuncias) - apenas admin futuramente
exports.listarDenuncias = (req, res) => {
  db.query("SELECT * FROM denuncias", (err, results) => {
    if (err) {
      console.error("Erro ao buscar denúncias:", err);
      return res.status(500).json({ erro: "Erro ao listar denúncias." });
    }
    res.json(results);
  });
};
