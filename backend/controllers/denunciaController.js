const db = require("../config/db");

// Criar denúncia (POST /denuncias)
exports.criarDenuncia = (req, res) => {
  const { denunciante_id, denunciado_id, atividade_id, motivo } = req.body;

  if (!denunciante_id || !motivo) {
    return res.status(400).json({
      erro: "Campos obrigatórios ausentes",
      detalhes: "denunciante_id e motivo são obrigatórios",
    });
  }

  const query = `
    INSERT INTO denuncias (denunciante_id, denunciado_id, atividade_id, motivo)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [denunciante_id, denunciado_id || null, atividade_id || null, motivo], (err, result) => {
    if (err) {
      console.error("Erro ao salvar denúncia:", err);
      return res.status(500).json({ erro: "Erro interno ao criar denúncia." });
    }

    res.status(201).json({
      mensagem: "Denúncia registrada com sucesso",
      id: result.insertId,
    });
  });
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

