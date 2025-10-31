const db = require("../config/db");

exports.criarEvento = async (req, res) => {
  const {
    titulo_evento,
    descricao_evento,
    data_evento,
    hora_inicio,
    hora_fim,
    local,
    participantes = [], // array de {id_usuario, tipo} (1=voluntário, 2=beneficiário)
  } = req.body;

  if (!titulo_evento || !data_evento) {
    return res.status(400).json({ erro: "Título e data são obrigatórios." });
  }

  try {
    // Extrai os IDs dos participantes do array (assume primeiro voluntário e primeiro beneficiário)
    const voluntario = participantes.find((p) => p.tipo === 1);
    const beneficiario = participantes.find((p) => p.tipo === 2);

    const [result] = await db.promise().query(
      `INSERT INTO eventos_voluntariado (titulo_evento, descricao_evento, data_evento, hora_inicio, hora_fim, local, id_voluntario, id_beneficiario)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo_evento,
        descricao_evento || null,
        data_evento,
        hora_inicio || null,
        hora_fim || null,
        local || null,
        voluntario ? voluntario.id_usuario : null,
        beneficiario ? beneficiario.id_usuario : null,
      ]
    );

    const eventId = result.insertId;

    return res.status(201).json({
      mensagem: "Evento criado com sucesso",
      id: eventId,
      id_voluntario: voluntario ? voluntario.id_usuario : null,
      id_beneficiario: beneficiario ? beneficiario.id_usuario : null,
    });
  } catch (err) {
    console.error("Erro ao criar evento:", err);
    res.status(500).json({ erro: "Erro interno ao criar evento." });
  }
};

exports.listarEventos = async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM eventos_voluntariado ORDER BY data_evento ASC");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar eventos:", err);
    res.status(500).json({ erro: "Erro ao buscar eventos." });
  }
};

exports.buscarEventoPorId = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM eventos_voluntariado WHERE id_evento = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ erro: "Evento não encontrado." });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao buscar evento:", err);
    res.status(500).json({ erro: "Erro ao buscar evento." });
  }
};

exports.atualizarEvento = async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    titulo_evento,
    descricao_evento,
    data_evento,
    hora_inicio,
    hora_fim,
    local,
  } = req.body;

  try {
    await db
      .promise()
      .query(
        `UPDATE eventos_voluntariado SET titulo_evento = ?, descricao_evento = ?, data_evento = ?, hora_inicio = ?, hora_fim = ?, local = ? WHERE id_evento = ?`,
        [
          titulo_evento,
          descricao_evento,
          data_evento,
          hora_inicio,
          hora_fim,
          local,
          id,
        ]
      );

    res.json({ mensagem: "Evento atualizado com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar evento:", err);
    res.status(500).json({ erro: "Erro ao atualizar evento." });
  }
};

exports.excluirEvento = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await db
      .promise()
      .query("DELETE FROM eventos_voluntariado WHERE id_evento = ?", [id]);
    res.json({ mensagem: "Evento excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir evento:", err);
    res.status(500).json({ erro: "Erro ao excluir evento." });
  }
};
