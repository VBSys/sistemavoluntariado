const db = require("../config/db");

exports.criarTipoUsuario = (req, res) => {
  const { nome_tipo } = req.body;

  if (!nome_tipo) {
    return res.status(400).json({ erro: "Campo nome_tipo é obrigatório" });
  }

  db.query(
    "INSERT INTO tipos_usuario (nome_tipo) VALUES (?)",
    [nome_tipo],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ erro: "Erro ao inserir tipo de usuário" });
      res.status(201).json({
        mensagem: "Tipo de usuário criado com sucesso",
        id: result.insertId,
      });
    }
  );
};
