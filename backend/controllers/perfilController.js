const db = require("../config/db");

// Criar perfil genérico (voluntário ou beneficiário)
exports.criarPerfil = (req, res) => {
  // Permite receber id_usuario no body ou usar o usuário autenticado
  const {
    id_usuario: idBody,
    nome,
    descricao,
    habilidade_1,
    habilidade_2,
    habilidade_3,
    necessidade_1,
    necessidade_2,
    necessidade_3,
  } = req.body;

  const id_usuario =
    idBody || (req.user && req.user.id_usuario) || (req.user && req.user.id);

  // Validação rigorosa do tamanho da descrição
  if (!descricao) {
    return res.status(400).json({
      erro: "A descrição é obrigatória",
    });
  }
  const descricaoLength = descricao.trim().length;
  if (descricaoLength > 400) {
    return res.status(400).json({
      erro: `A descrição tem ${descricaoLength} caracteres. Máximo permitido: 400.`,
    });
  }
  if (
    habilidade_1?.length > 20 ||
    habilidade_2?.length > 20 ||
    habilidade_3?.length > 20
  ) {
    return res.status(400).json({
      erro: "As habilidades não podem ter mais que 20 caracteres.",
    });
  }

  // Validação para necessidades (para beneficiários) - mesmos limites das habilidades
  if (
    (necessidade_1 && necessidade_1.length > 20) ||
    (necessidade_2 && necessidade_2.length > 20) ||
    (necessidade_3 && necessidade_3.length > 20)
  ) {
    return res.status(400).json({
      erro: "As necessidades não podem ter mais que 20 caracteres.",
    });
  }

  if (!id_usuario || !nome || !descricao) {
    return res.status(400).json({
      erro: "Campos obrigatórios ausentes. Deve informar id_usuario (ou estar autenticado), nome e descricao.",
    });
  }
  const sql = `
    INSERT INTO perfil (
      id_usuario,
      nome,
      descricao,
      habilidade_1,
      habilidade_2,
      habilidade_3,
      necessidade_1,
      necessidade_2,
      necessidade_3
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      necessidade_1 || null,
      necessidade_2 || null,
      necessidade_3 || null,
    ],
    (err, result) => {
      if (err) {
        console.error("Erro ao criar perfil:", err);
        return res.status(500).json({ erro: err.message });
      }

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
