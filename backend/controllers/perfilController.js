const db = require("../config/db");

// Criar perfil genérico (voluntário ou beneficiário)
exports.criarPerfil = (req, res) => {
  const {
    id_usuario,
    nome,
    descricao,
    habilidade_1,
    habilidade_2,
    habilidade_3,
  } = req.body;

  if (!id_usuario || !nome || !descricao) {
    return res.status(400).json({ erro: "Campos obrigatórios ausentes." });
  }

  const sql = `
    INSERT INTO perfil (
      id_usuario,
      nome,
      descricao,
      habilidades_1,
      habilidades_2,
      habilidades_3
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      id_usuario,
      nome,
      descricao,
      habilidade_1 || null,
      habilidade_2 || null,
      habilidade_3 || null,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ erro: err.message });

      res.status(201).json({
        mensagem: "Perfil criado com sucesso!",
        id_perfil: result.insertId,
      });
    }
  );
};

// Buscar perfil por usuário
exports.buscarPerfilPorUsuario = (req, res) => {
  const { id_usuario } = req.params;

  const sql = `SELECT * FROM perfil WHERE id_usuario = ?`;

  db.query(sql, [id_usuario], (err, resultado) => {
    if (err) return res.status(500).json({ erro: err.message });

    res.status(200).json({ perfil: resultado });
  });
};
