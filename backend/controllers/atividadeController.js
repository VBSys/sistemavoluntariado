const db = require("../config/db");

// Registrar nova atividade
exports.criarAtividade = (req, res) => {
  const { titulo, descricao, data_inicio, data_fim } = req.body;

  if (!titulo || !descricao) {
    return res.status(400).json({ erro: "Título e descrição são obrigatórios" });
  }

  const sql = `
    INSERT INTO atividades (titulo, descricao, data_inicio, data_fim)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [titulo, descricao, data_inicio, data_fim], (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao registrar atividade" });

    res.status(201).json({
      mensagem: "Atividade registrada",
      atividade: {
        id_atividade: result.insertId,
        titulo,
        descricao,
        data_inicio,
        data_fim
      }
    });
  });
};

// Listar todas as atividades
exports.listarAtividades = (req, res) => {
  db.query("SELECT * FROM atividades", (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar atividades" });
    res.json(results);
  });
};

// Buscar detalhes de uma atividade
exports.buscarAtividadePorId = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM atividades WHERE id_atividade = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar atividade" });
    if (results.length === 0) return res.status(404).json({ erro: "Atividade não encontrada" });
    res.json(results[0]);
  });
};

// Atualizar atividade
exports.atualizarAtividade = (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, data_inicio, data_fim } = req.body;

  const sql = `
    UPDATE atividades 
    SET titulo = ?, descricao = ?, data_inicio = ?, data_fim = ?
    WHERE id_atividade = ?
  `;

  db.query(sql, [titulo, descricao, data_inicio, data_fim, id], (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao atualizar atividade" });
    if (result.affectedRows === 0) return res.status(404).json({ erro: "Atividade não encontrada" });

    res.json({ mensagem: "Atividade atualizada com sucesso" });
  });
};

// Remover atividade
exports.removerAtividade = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM atividades WHERE id_atividade = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao remover atividade" });
    if (result.affectedRows === 0) return res.status(404).json({ erro: "Atividade não encontrada" });

    res.json({ mensagem: "Atividade removida com sucesso" });
  });
};
