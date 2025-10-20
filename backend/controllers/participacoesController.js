const db = require("../config/db");

exports.criarParticipacao = async (req, res) => {
  const {
    id_evento,
    id_voluntario,
    id_beneficiario,
    status = "pendente",
  } = req.body;

  if (!id_evento || (!id_voluntario && !id_beneficiario)) {
    return res
      .status(400)
      .json({ erro: "Evento e participante são obrigatórios." });
  }

  try {
    const [result] = await db.promise().query(
      `INSERT INTO participacoes_evento (id_evento, id_voluntario, id_beneficiario, status)
       VALUES (?, ?, ?, ?)`,
      [id_evento, id_voluntario || null, id_beneficiario || null, status]
    );

    res.status(201).json({
      mensagem: "Participação registrada com sucesso",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Erro ao registrar participação:", err);
    res.status(500).json({ erro: "Erro ao registrar participação." });
  }
};

exports.listarParticipacoes = async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM participacoes_evento");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar participações:", err);
    res.status(500).json({ erro: "Erro ao buscar participações." });
  }
};

exports.listarPorEvento = async (req, res) => {
  const id_evento = parseInt(req.params.id_evento);

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM participacoes_evento WHERE id_evento = ?", [
        id_evento,
      ]);
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar participações:", err);
    res.status(500).json({ erro: "Erro ao buscar participações." });
  }
};

exports.atualizarStatus = async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  try {
    await db
      .promise()
      .query(
        "UPDATE participacoes_evento SET status = ? WHERE id_participacao = ?",
        [status, id]
      );
    res.json({ mensagem: "Status atualizado com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
    res.status(500).json({ erro: "Erro ao atualizar status." });
  }
};

exports.excluirParticipacao = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await db
      .promise()
      .query("DELETE FROM participacoes_evento WHERE id_participacao = ?", [
        id,
      ]);
    res.json({ mensagem: "Participação excluída com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir participação:", err);
    res.status(500).json({ erro: "Erro ao excluir participação." });
  }
};
