const db = require("../config/db");

// Registrar avaliação (POST /avaliacoes)
exports.criarAvaliacao = (req, res) => {
  const { voluntario_id, pcd_id, nota, comentario } = req.body;

  if (!voluntario_id || !pcd_id || !nota) {
    return res.status(400).json({
      error: "Preencha todos os campos obrigatórios (voluntario_id, pcd_id, nota).",
    });
  }

  const query = `
    INSERT INTO avaliacoes (voluntario_id, pcd_id, nota, comentario)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [voluntario_id, pcd_id, nota, comentario || null], (err, result) => {
    if (err) {
      console.error("❌ Erro ao salvar avaliação:", err);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }

    res.status(201).json({
      message: "Avaliação registrada com sucesso!",
      id: result.insertId,
    });
  });
};

// Ver avaliações de um voluntário (GET /avaliacoes/:id)
exports.listarAvaliacoesPorVoluntario = (req, res) => {
  const voluntarioId = req.params.id;

  const query = "SELECT * FROM avaliacoes WHERE voluntario_id = ?";
  db.query(query, [voluntarioId], (err, results) => {
    if (err) {
      console.error("❌ Erro ao buscar avaliações:", err);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }

    res.json(results);
  });
};
