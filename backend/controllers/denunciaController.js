const db = require("../config/db");

// Criar denúncia (POST /denuncias)
// Requer autenticação (middleware `autenticar`) — o `id_usuario` vem do token
exports.criarDenuncia = (req, res) => {
  const { email_destinatario, motivo, descricao } = req.body;

  if (!email_destinatario || !motivo || !descricao) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
  }

  // Buscar o ID do destinatário pelo e-mail
  db.query(
    "SELECT id_usuario FROM usuarios WHERE email = ?",
    [email_destinatario],
    (err, results) => {
      if (err)
        return res.status(500).json({ erro: "Erro ao buscar destinatário" });
      if (results.length === 0)
        return res
          .status(404)
          .json({ erro: "Usuário destinatário não encontrado" });

      const id_destinatario = results[0].id_usuario;

      // Inserir denúncia
      const sql = `
      INSERT INTO denuncias (id_remetente, id_destinatario, motivo, descricao, status, email_denunciante)
      VALUES (?, ?, ?, ?, 'pendente', (SELECT email FROM usuarios WHERE id_usuario = ?))
    `;

      db.query(
        sql,
        [id_remetente, id_destinatario, motivo, descricao, id_remetente],
        (err2) => {
          if (err2)
            return res.status(500).json({ erro: "Erro ao registrar denúncia" });

          res.status(201).json({ mensagem: "Denúncia registrada com sucesso" });
        }
      );
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
