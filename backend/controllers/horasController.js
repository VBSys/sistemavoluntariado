const db = require("../config/db");

// Total de horas acumuladas por voluntário (atividades)
exports.totalHorasVoluntario = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT v.id_usuario, v.nome_completo, SUM(a.carga_horaria) AS total_horas
    FROM voluntarios_atividades va
    JOIN usuarios v ON va.id_voluntario = v.id_usuario
    JOIN atividades a ON va.id_atividade = a.id_atividade
    WHERE v.id_usuario = ?
    GROUP BY v.id_usuario, v.nome_completo
  `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao calcular horas" });
    if (results.length === 0)
      return res
        .status(404)
        .json({ erro: "Voluntário não encontrado ou sem horas" });

    res.json(results[0]);
  });
};

// Gerar certificado com base nas horas de atividades
exports.gerarCertificado = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT v.id_usuario, v.nome_completo, SUM(a.carga_horaria) AS total_horas
    FROM voluntarios_atividades va
    JOIN usuarios v ON va.id_voluntario = v.id_usuario
    JOIN atividades a ON va.id_atividade = a.id_atividade
    WHERE v.id_usuario = ?
    GROUP BY v.id_usuario, v.nome_completo
  `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao gerar certificado" });
    if (results.length === 0)
      return res
        .status(404)
        .json({ erro: "Voluntário não encontrado ou sem horas" });

    const voluntario = results[0];
    const certificado = {
      nome: voluntario.nome_completo,
      horas: voluntario.total_horas,
      data_emissao: new Date(),
      mensagem: "Certificado de participação emitido com sucesso",
    };

    res.json(certificado);
  });
};

// Total de horas complementares por voluntário (horas_registradas)
exports.totalHorasComplementares = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT v.id_usuario, v.nome_completo, SUM(hr.horas) AS horas_complementares
    FROM horas_registradas hr
    JOIN usuarios v ON hr.id_voluntario = v.id_usuario
    WHERE v.id_usuario = ?
    GROUP BY v.id_usuario, v.nome_completo
  `;

  db.query(sql, [id], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ erro: "Erro ao buscar horas complementares" });
    if (results.length === 0)
      return res
        .status(404)
        .json({
          erro: "Voluntário não encontrado ou sem horas complementares",
        });

    res.json(results[0]);
  });
};
