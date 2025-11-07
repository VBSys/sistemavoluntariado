const db = require("../config/db");

exports.listarConversas = (req, res) => {
  const id_logado = req.usuario.id_usuario; // vem do token JWT

  const sql = `
    SELECT 
      u.id_usuario,
      u.nome_completo,
      u.email,
      MAX(m.data_envio) AS ultima_mensagem
    FROM mensagens m
    JOIN usuarios u ON u.id_usuario = 
      CASE 
        WHEN m.id_remetente = ? THEN m.id_destinatario
        ELSE m.id_remetente
      END
    WHERE m.id_remetente = ? OR m.id_destinatario = ?
    GROUP BY u.id_usuario, u.nome_completo, u.email
    ORDER BY ultima_mensagem DESC
  `;

  db.query(sql, [id_logado, id_logado, id_logado], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao listar conversas" });

    res.json({ conversas: results });
  });
};
