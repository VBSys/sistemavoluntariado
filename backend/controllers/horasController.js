const db = require("../config/db");

//
// 📌 Registrar horas complementares (voluntário)
//
exports.registrarHorasComplementares = (req, res) => {
  const { id_atividade, horas } = req.body;
  const id_voluntario = req.user.id;

  if (!id_atividade || !horas) {
    return res.status(400).json({
      erro: "Campos obrigatórios ausentes: id_atividade e horas",
    });
  }

  const sql = `
    INSERT INTO horas_registradas (id_voluntario, id_atividade, horas)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [id_voluntario, id_atividade, horas], (err, result) => {
    if (err) {
      console.error("❌ Erro ao registrar horas:", err.message);
      return res.status(500).json({ erro: "Erro ao registrar horas" });
    }

    res.status(201).json({
      mensagem: "Horas complementares registradas com sucesso",
      id_registro: result.insertId,
    });
  });
};

//
// 📌 Total de horas acumuladas por voluntário (atividades oficiais)
//
exports.totalHorasVoluntario = (req, res) => {
  const { id } = req.params;

  // Como tabela 'atividades' foi removida, calculamos total pelas horas_registradas
  const sql = `
    SELECT v.id_usuario, v.nome_completo, COALESCE(SUM(hr.horas),0) AS total_horas
    FROM horas_registradas hr
    JOIN usuarios v ON hr.id_voluntario = v.id_usuario
    WHERE v.id_usuario = ?
    GROUP BY v.id_usuario, v.nome_completo
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ Erro ao calcular horas:", err.message);
      return res.status(500).json({ erro: "Erro ao calcular horas" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ erro: "Voluntário não encontrado ou sem horas" });
    }

    res.json(results[0]);
  });
};

//
// 📌 Gerar certificado com base nas horas de atividades
//
exports.gerarCertificado = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT v.id_usuario, v.nome_completo, COALESCE(SUM(hr.horas),0) AS total_horas
    FROM horas_registradas hr
    JOIN usuarios v ON hr.id_voluntario = v.id_usuario
    WHERE v.id_usuario = ?
    GROUP BY v.id_usuario, v.nome_completo
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ Erro ao gerar certificado:", err.message);
      return res.status(500).json({ erro: "Erro ao gerar certificado" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ erro: "Voluntário não encontrado ou sem horas" });
    }

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

//
// 📌 Total de horas complementares por voluntário
//
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
    if (err) {
      console.error("❌ Erro ao buscar horas complementares:", err.message);
      return res
        .status(500)
        .json({ erro: "Erro ao buscar horas complementares" });
    }

    if (results.length === 0) {
      return res.status(404).json({
        erro: "Voluntário não encontrado ou sem horas complementares",
      });
    }

    res.json(results[0]);
  });
};
