const connection = require("../config/db");
const promiseConn = connection.promise();

// Helper para escolher a tabela de perfil com base no tipo de usuário
async function tabelaPerfilParaUsuario(id_usuario) {
  const [rows] = await promiseConn.query(
    "SELECT id_tipo FROM usuarios WHERE id_usuario = ?",
    [id_usuario]
  );
  const user = rows[0];
  if (!user) return null;
  return user.id_tipo === 1 ? "perfil_voluntario" : "perfil_beneficiario";
}

exports.cadastrarHabilidades = async (req, res) => {
  const { habilidades } = req.body;
  const id_usuario = parseInt(req.params.id, 10);

  if (req.user.id !== id_usuario) {
    return res
      .status(403)
      .json({ erro: "Você só pode editar seu próprio perfil." });
  }

  if (!Array.isArray(habilidades) || habilidades.length > 3) {
    return res.status(400).json({ erro: "Máximo de 3 habilidades permitido." });
  }

  try {
    const tabela = await tabelaPerfilParaUsuario(id_usuario);
    if (!tabela)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    // Remove registros antigos desse usuário na tabela de perfil
    await promiseConn.query(`DELETE FROM ${tabela} WHERE id_usuario = ?`, [
      id_usuario,
    ]);

    // Insere novas linhas de perfil, com descricao NULL e id_necessidade setado
    for (let hab of habilidades) {
      let id_habilidade = null;
      if (typeof hab === "number") {
        id_habilidade = hab;
      } else if (typeof hab === "string") {
        const [hrows] = await promiseConn.query(
          "SELECT id_habilidade FROM habilidades WHERE nome_habilidade = ? LIMIT 1",
          [hab]
        );
        if (hrows && hrows[0]) id_habilidade = hrows[0].id_habilidade;
      }

      if (!id_habilidade) continue; // pula se não encontrou

      await promiseConn.query(
        `INSERT INTO ${tabela} (id_usuario, descricao, id_necessidade) VALUES (?, NULL, ?)`,
        [id_usuario, id_habilidade]
      );
    }

    res.status(201).json({ mensagem: "Habilidades atualizadas com sucesso." });
  } catch (err) {
    console.error("Erro ao salvar habilidades:", err);
    res.status(500).json({ erro: "Erro ao salvar habilidades." });
  }
};

/////////////////////
exports.editarHabilidades = async (req, res) => {
  // Comportamento idêntico a cadastrarHabilidades (substitui todas)
  return exports.cadastrarHabilidades(req, res);
};

////////////////////
exports.listarHabilidades = async (req, res) => {
  const id_usuario = parseInt(req.params.id, 10);

  try {
    const tabela = await tabelaPerfilParaUsuario(id_usuario);
    if (!tabela)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    const [rows] = await promiseConn.query(
      `SELECT p.id_necessidade AS id_habilidade, h.nome_habilidade
       FROM ${tabela} p
       JOIN habilidades h ON p.id_necessidade = h.id_habilidade
       WHERE p.id_usuario = ?`,
      [id_usuario]
    );

    res.status(200).json({ habilidades: rows });
  } catch (err) {
    console.error("Erro ao buscar habilidades:", err);
    res.status(500).json({ erro: "Erro ao buscar habilidades." });
  }
};
