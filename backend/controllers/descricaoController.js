const db = require("../config/db");

exports.cadastrarDescricao = (req, res) => {
  const { id } = req.params; // id_usuario
  const { descricao } = req.body;

  if (!id)
    return res.status(400).json({ erro: "id do usuário ausente na URL" });
  if (!descricao)
    return res.status(400).json({ erro: "descricao ausente no body" });

  db.query(
    "SELECT id_perfil FROM perfil WHERE id_usuario = ?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ erro: err.message });

      if (rows.length === 0) {
        const sql = `INSERT INTO perfil (id_usuario, descricao) VALUES (?, ?)`;
        db.query(sql, [id, descricao], (err2, result) => {
          if (err2) return res.status(500).json({ erro: err2.message });
          return res
            .status(201)
            .json({
              mensagem: "Descrição cadastrada",
              id_perfil: result.insertId,
            });
        });
      } else {
        const sql = `UPDATE perfil SET descricao = ? WHERE id_usuario = ?`;
        db.query(sql, [descricao, id], (err3) => {
          if (err3) return res.status(500).json({ erro: err3.message });
          return res.json({ mensagem: "Descrição atualizada" });
        });
      }
    }
  );
};

exports.listarDescricao = (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ erro: "id do usuário ausente na URL" });

  db.query(
    "SELECT descricao FROM perfil WHERE id_usuario = ?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ erro: err.message });
      if (rows.length === 0)
        return res.status(404).json({ erro: "Perfil não encontrado" });
      return res.json(rows[0]);
    }
  );
};
