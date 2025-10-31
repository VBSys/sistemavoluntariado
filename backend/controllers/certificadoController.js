const db = require("../config/db");

// Gera o certificado apenas do usuário logado
exports.gerarCertificado = (req, res) => {
  const { id_usuario, id_tipo } = req.user; // vem do token JWT

  // Permite apenas usuários voluntários (id_tipo = 1)
  if (id_tipo !== 1) {
    return res.status(403).json({
      erro: "Apenas voluntários podem gerar certificados."
    });
  }

  const query = `
    SELECT 
      u.id_usuario,
      u.nome_completo,
      u.email,
      COALESCE(SUM(h.horas), 0) AS total_horas
    FROM usuarios u
    LEFT JOIN horas_registradas h 
      ON u.id_usuario = h.id_voluntario
    WHERE u.id_usuario = ?
    GROUP BY u.id_usuario, u.nome_completo, u.email
    LIMIT 1;
  `;

  db.query(query, [id_usuario], (err, resultado) => {
    if (err) {
      console.error("❌ Erro ao buscar certificado:", err.message);
      return res.status(500).json({ erro: "Erro ao buscar certificado" });
    }

    if (resultado.length === 0) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado ou sem cadastro válido."
      });
    }

    const voluntario = resultado[0];

    res.status(200).json({
      nome: voluntario.nome_completo,
      email: voluntario.email,
      total_horas: parseFloat(voluntario.total_horas),
      mensagem: `Certificado gerado para ${voluntario.nome_completo}`
    });
  });
};