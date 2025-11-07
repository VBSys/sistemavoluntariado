const db = require("../config/db");

// Cadastrar ou atualizar habilidades do usuário (id no path)
exports.cadastrarHabilidades = (req, res) => {
  const { id } = req.params; // id_usuario
  const { habilidade_1, habilidade_2, habilidade_3 } = req.body;

  if (!id)
    return res.status(400).json({ erro: "id do usuário ausente na URL" });

  // Verifica se já existe perfil
  db.query(
    "SELECT id_perfil FROM perfil WHERE id_usuario = ?",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ erro: err.message });

      if (rows.length === 0) {
        // Inserir
        const sql = `INSERT INTO perfil (id_usuario, habilidade_1, habilidade_2, habilidade_3) VALUES (?, ?, ?, ?)`;
        db.query(
          sql,
          [
            id,
            habilidade_1 || null,
            habilidade_2 || null,
            habilidade_3 || null,
          ],
          (err2, result) => {
            if (err2) return res.status(500).json({ erro: err2.message });
            return res.status(201).json({
              mensagem: "Habilidades cadastradas",
              id_perfil: result.insertId,
            });
          }
        );
      } else {
        // Atualizar
        const sql = `UPDATE perfil SET habilidade_1 = ?, habilidade_2 = ?, habilidade_3 = ? WHERE id_usuario = ?`;
        db.query(
          sql,
          [
            habilidade_1 || null,
            habilidade_2 || null,
            habilidade_3 || null,
            id,
          ],
          (err3) => {
            if (err3) return res.status(500).json({ erro: err3.message });
            return res.json({ mensagem: "Habilidades atualizadas" });
          }
        );
      }
    }
  );
};

exports.listarHabilidades = (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ erro: "id do usuário ausente na URL" });

  const sql = `SELECT habilidade_1, habilidade_2, habilidade_3 FROM perfil WHERE id_usuario = ?`;
  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (rows.length === 0)
      return res.status(404).json({ erro: "Perfil não encontrado" });
    return res.json(rows[0]);
  });
};

exports.editarHabilidades = (req, res) => {
  // Reusa cadastrarHabilidades -> atualiza se existir
  return exports.cadastrarHabilidades(req, res);
};
