exports.buscarHistorico = (req, res) => {
  const { id1, id2 } = req.params;

  const query = `
    SELECT * FROM chat_mensagens
    WHERE (id_remetente = ? AND id_destinatario = ?)
       OR (id_remetente = ? AND id_destinatario = ?)
    ORDER BY data_envio ASC
  `;

  db.query(query, [id1, id2, id2, id1], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar histórico" });
    res.json(results);
  });
};
