const connection = require("../config/db");
const promiseConn = connection.promise();

exports.cadastrarDescricao = async (req, res) => {
  const { descricao } = req.body;
  const id_usuario = parseInt(req.params.id, 10);

  if (!req.user || req.user.id !== id_usuario) {
    return res
      .status(403)
      .json({ erro: "Você só pode editar seu próprio perfil." });
  }

  // aceita string ou array de descrições
  let descricoes = [];

  if (typeof descricao === "string") {
    const trimmed = descricao.trim();
    if (trimmed.length > 0) descricoes = [trimmed];
  } else {
    return res
      .status(400)
      .json({ erro: "Campo 'descricao' deve ser string ou array de strings" });
  }

  try {
    // Remove descrições antigas do usuário (caso exista)
    await promiseConn.query(
      "DELETE FROM usuarios_descricao WHERE id_usuario = ?",
      [id_usuario]
    );

    // Insere novas descrições (se houver)
    for (const desc of descricoes) {
      await promiseConn.query(
        "INSERT INTO usuarios_descricao (id_usuario, descricao) VALUES (?, ?)",
        [id_usuario, desc]
      );
    }

    return res
      .status(201)
      .json({ mensagem: "Descrição(s) atualizada(s) com sucesso." });
  } catch (err) {
    console.error("Erro ao salvar descricao:", err);
    return res.status(500).json({ erro: "Erro ao salvar descricao." });
  }
};

// Lista descrições do usuário
exports.listarDescricao = async (req, res) => {
  const id_usuario = parseInt(req.params.id, 10);
  try {
    const [rows] = await promiseConn.query(
      "SELECT descricao FROM usuarios_descricao WHERE id_usuario = ?",
      [id_usuario]
    );
    const descricoes = rows.map((r) => r.descricao);
    res.json({ id_usuario, descricoes });
  } catch (err) {
    console.error("Erro ao buscar descricao:", err);
    res.status(500).json({ erro: "Erro ao buscar descricao." });
  }
};
