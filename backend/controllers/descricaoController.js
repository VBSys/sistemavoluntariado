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

exports.cadastrarDescricao = async (req, res) => {
  const { descricao } = req.body;
  const id_usuario = parseInt(req.params.id, 10);

  if (!req.user || req.user.id !== id_usuario) {
    return res
      .status(403)
      .json({ erro: "Você só pode editar seu próprio perfil." });
  }

  if (typeof descricao !== "string") {
    return res
      .status(400)
      .json({ erro: "Campo 'descricao' deve ser uma string" });
  }

  try {
    const tabela = await tabelaPerfilParaUsuario(id_usuario);
    if (!tabela)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    // Tenta atualizar uma linha existente
    const [updateResult] = await promiseConn.query(
      `UPDATE ${tabela} SET descricao = ? WHERE id_usuario = ?`,
      [descricao.trim(), id_usuario]
    );

    // Se não havia registro, cria um novo (id_necessidade NULL)
    if (updateResult.affectedRows === 0) {
      await promiseConn.query(
        `INSERT INTO ${tabela} (id_usuario, descricao, id_necessidade) VALUES (?, ?, NULL)`,
        [id_usuario, descricao.trim()]
      );
    }

    return res
      .status(201)
      .json({ mensagem: "Descrição atualizada com sucesso." });
  } catch (err) {
    console.error("Erro ao salvar descricao:", err);
    return res.status(500).json({ erro: "Erro ao salvar descricao." });
  }
};

// Lista descrições do usuário (retorna array para compatibilidade)
exports.listarDescricao = async (req, res) => {
  const id_usuario = parseInt(req.params.id, 10);
  try {
    const tabela = await tabelaPerfilParaUsuario(id_usuario);
    if (!tabela)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    const [rows] = await promiseConn.query(
      `SELECT descricao FROM ${tabela} WHERE id_usuario = ?`,
      [id_usuario]
    );
    const descricoes = rows.map((r) => r.descricao).filter(Boolean);
    res.json({ id_usuario, descricoes });
  } catch (err) {
    console.error("Erro ao buscar descricao:", err);
    res.status(500).json({ erro: "Erro ao buscar descricao." });
  }
};
