const db = require("../config/db");

exports.deletarUsuario = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM usuarios WHERE id_usuario = ?";

  db.query("DELETE FROM denuncias WHERE id_usuario = ?", [id], (err) => {
    if (err) return res.status(500).json({ erro: "Erro ao deletar denúncias" });

    db.query(
      "DELETE FROM usuarios WHERE id_usuario = ?",
      [id],
      (err2, resultado) => {
        if (err2)
          return res.status(500).json({ erro: "Erro ao deletar usuário" });
        if (resultado.affectedRows === 0)
          return res.status(404).json({ erro: "Usuário não encontrado" });

        res.json({ mensagem: "Usuário e denúncias deletados com sucesso" });
      }
    );
  });
};

// Buscar usuários por nome ou e-mail
exports.consultarUsuarios = (req, res) => {
  const { nome, email } = req.query;

  let sql = "SELECT * FROM usuarios WHERE 1=1";
  const params = [];

  if (nome) {
    sql += " AND nome_completo LIKE ?";
    params.push(`%${nome}%`);
  }

  if (email) {
    sql += " AND email LIKE ?";
    params.push(`%${email}%`);
  }

  db.query(sql, params, (err, resultado) => {
    if (err) return res.status(500).json({ erro: err.message });

    res.status(200).json({ usuarios: resultado });
  });
};

exports.buscarUsuarioPorId = (req, res) => {
  const { id } = req.params;

  const sql = `
      SELECT id_usuario, nome_completo, email, id_tipo
      FROM usuarios
      WHERE id_usuario = ?
    `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar usuário" });
    if (results.length === 0)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    res.json(results[0]);
  });
};

exports.buscarTodosUsuarios = (req, res) => {
  const sql = "SELECT * FROM usuarios";

  db.query(sql, (err, resultado) => {
    if (err) return res.status(500).json({ erro: err.message });

    res.status(200).json({ usuarios: resultado });
  });
};

// Listar usuários por tipo (ex.: voluntário/beneficiário)
exports.listarPorTipo = (req, res) => {
  const { id_tipo } = req.params;

  const query = `
      SELECT u.id_usuario, u.nome_completo, u.email, u.id_tipo
      FROM usuarios u
      WHERE u.id_tipo = ?
    `;

  db.query(query, [id_tipo], (err, results) => {
    if (err)
      return res.status(500).json({ erro: "Erro ao buscar usuários por tipo" });
    res.json(results);
  });
};

// Deletar usuário por e-mail (apenas admin)
exports.deletarUsuarioPorEmail = (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ erro: "Parâmetro 'email' é obrigatório" });
  }

  // Primeiro buscar o usuário para obter o id
  db.query(
    "SELECT id_usuario FROM usuarios WHERE email = ? LIMIT 1",
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ erro: err.message });
      if (!results || results.length === 0)
        return res.status(404).json({ erro: "Usuário não encontrado" });

      const id = results[0].id_usuario;

      // Deletar denúncias associadas (se houver) e depois o usuário
      db.query("DELETE FROM denuncias WHERE id_usuario = ?", [id], (errDel) => {
        if (errDel)
          return res.status(500).json({ erro: "Erro ao deletar denúncias" });

        db.query(
          "DELETE FROM usuarios WHERE id_usuario = ?",
          [id],
          (err2, resultado) => {
            if (err2)
              return res.status(500).json({ erro: "Erro ao deletar usuário" });
            if (resultado.affectedRows === 0)
              return res.status(404).json({ erro: "Usuário não encontrado" });

            res.json({
              mensagem: "Usuário e denúncias deletados com sucesso",
              email,
            });
          }
        );
      });
    }
  );
};
