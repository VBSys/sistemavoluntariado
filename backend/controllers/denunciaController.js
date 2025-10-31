const db = require("../config/db");

// Criar denúncia (POST /denuncias)
exports.criarDenuncia = (req, res) => {
  const {
    id_usuario, // quem está denunciando
    id_evento, // evento relacionado (opcional)
    motivo,
    descricao,
    status = "pendente", // valor padrão
    email_denunciado, // quem está sendo denunciado
  } = req.body;

  if (!id_usuario || !motivo || !email_denunciado) {
    return res.status(400).json({
      erro: "Campos obrigatórios ausentes",
      detalhes: "id_usuario, motivo e email_denunciado são obrigatórios",
    });
  }

  const query = `
    INSERT INTO denuncias (id_usuario, id_evento, motivo, descricao, status, email_denunciado)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      id_usuario,
      id_evento || null,
      motivo,
      descricao || null,
      status,
      email_denunciado,
    ],
    (err, result) => {
      if (err) {
        console.error("Erro ao salvar denúncia:", err);
        return res
          .status(500)
          .json({ erro: "Erro interno ao criar denúncia." });
      }

      res.status(201).json({
        mensagem: "Denúncia registrada com sucesso",
        id: result.insertId,
      });
    }
  );
};
// Listar todas as denúncias (GET /denuncias) - apenas admin futuramente
exports.listarDenuncias = (req, res) => {
  const { pagina = 1, limite = 10 } = req.query;

  const offset = (pagina - 1) * limite;

  const query = `
    SELECT 
      id_denuncia,
      id_usuario,
      id_evento,
      motivo,
      descricao,
      status,
      data_denuncia
    FROM denuncias
    ORDER BY data_denuncia DESC
    LIMIT ? OFFSET ?
  `;

  db.query(query, [parseInt(limite), parseInt(offset)], (err, resultado) => {
    if (err) {
      console.error("❌ Erro ao listar denúncias:", err.message);
      return res.status(500).json({ erro: "Erro ao buscar denúncias" });
    }

    res.json({
      pagina: parseInt(pagina),
      limite: parseInt(limite),
      total: resultado.length,
      denuncias: resultado,
    });
  });
};