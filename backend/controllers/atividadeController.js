const db = require("../config/db");

//
// 📌 Registrar nova atividade (admin)
//
exports.criarAtividade = (req, res) => {
  const { titulo, descricao, data_inicio, data_fim } = req.body;

  if (!titulo || !descricao) {
    return res.status(400).json({
      erro: "Título e descrição são obrigatórios",
    });
  }

  const sql = `
    INSERT INTO atividades (titulo, descricao, data_inicio, data_fim)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [titulo, descricao, data_inicio, data_fim], (err, result) => {
    if (err) {
      console.error("❌ Erro ao registrar atividade:", err.message);
      return res.status(500).json({ erro: "Erro ao registrar atividade" });
    }

    res.status(201).json({
      mensagem: "Atividade registrada com sucesso",
      atividade: {
        id_atividade: result.insertId,
        titulo,
        descricao,
        data_inicio,
        data_fim,
      },
    });
  });
};

//
// 📌 Listar todas as atividades (todos os perfis)
//
exports.listarAtividades = (req, res) => {
  const sql = "SELECT * FROM atividades";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Erro ao buscar atividades:", err.message);
      return res.status(500).json({ erro: "Erro ao buscar atividades" });
    }

    res.json(results);
  });
};

//
// 📌 Buscar detalhes de uma atividade por ID
//
exports.buscarAtividadePorId = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM atividades WHERE id_atividade = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ Erro ao buscar atividade:", err.message);
      return res.status(500).json({ erro: "Erro ao buscar atividade" });
    }

    if (results.length === 0) {
      return res.status(404).json({ erro: "Atividade não encontrada" });
    }

    res.json(results[0]);
  });
};

//
// 📌 Atualizar atividade (admin)
//
exports.atualizarAtividade = (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, data_inicio, data_fim } = req.body;

  const sql = `
    UPDATE atividades 
    SET titulo = ?, descricao = ?, data_inicio = ?, data_fim = ?
    WHERE id_atividade = ?
  `;

  db.query(
    sql,
    [titulo, descricao, data_inicio, data_fim, id],
    (err, result) => {
      if (err) {
        console.error("❌ Erro ao atualizar atividade:", err.message);
        return res.status(500).json({ erro: "Erro ao atualizar atividade" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ erro: "Atividade não encontrada" });
      }

      res.json({ mensagem: "Atividade atualizada com sucesso" });
    }
  );
};

//
// 📌 Remover atividade (admin)
//
exports.removerAtividade = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM atividades WHERE id_atividade = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Erro ao remover atividade:", err.message);
      return res.status(500).json({ erro: "Erro ao remover atividade" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Atividade não encontrada" });
    }

    res.json({ mensagem: "Atividade removida com sucesso" });
  });
};
