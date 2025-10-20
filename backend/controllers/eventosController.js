const db = require("../config/db");

exports.criarEvento = async (req, res) => {
  const {
    titulo_evento,
    descricao_evento,
    data_evento,
    hora_inicio,
    hora_fim,
    local,
  } = req.body;

  if (!titulo_evento || !data_evento) {
    return res.status(400).json({ erro: "Título e data são obrigatórios." });
  }

  try {
    const [result] = await db.promise().query(
      `INSERT INTO eventos_voluntariado (titulo_evento, descricao_evento, data_evento, hora_inicio, hora_fim, local)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        titulo_evento,
        descricao_evento || null,
        data_evento,
        hora_inicio || null,
        hora_fim || null,
        local || null,
      ]
    );

    const eventId = result.insertId;

    // Se houver usuário autenticado e for voluntário ou beneficiário, crie também uma participação
    try {
      const creatorId = req.user ? req.user.id : null;
      const creatorTipo = req.user ? req.user.id_tipo : null;

      if (creatorId && (creatorTipo === 1 || creatorTipo === 2)) {
        // Monta dinamicamente colunas e valores, para não inserir colunas nulas
        const cols = ["id_evento"];
        const placeholders = ["?"];
        const values = [eventId];

        if (creatorTipo === 1) {
          cols.push("id_voluntario");
          placeholders.push("?");
          values.push(creatorId);
        } else if (creatorTipo === 2) {
          cols.push("id_beneficiario");
          placeholders.push("?");
          values.push(creatorId);
        }

        // log SQL e valores para diagnóstico (remover em produção se necessário)
        console.log("SQL participacao:", sql);
        console.log("Valores participacao:", values);
        cols.push("status");
        placeholders.push("?");
        values.push("confirmado");

        const sql = `INSERT INTO participacoes_evento (${cols.join(
          ", "
        )}) VALUES (${placeholders.join(", ")})`;

        const [partResult] = await db.promise().query(sql, values);

        return res.status(201).json({
          mensagem: "Evento criado com sucesso",
          id: eventId,
          participacao_id: partResult.insertId,
        });
      }

      // Se não há usuário autenticado ou é admin, apenas retorna o evento criado
      return res
        .status(201)
        .json({ mensagem: "Evento criado com sucesso", id: eventId });
    } catch (errPart) {
      console.error("Erro ao criar participação do evento:", errPart);
      return res.status(201).json({
        mensagem:
          "Evento criado, porém falhou ao registrar participação do criador",
        id: eventId,
      });
    }
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
