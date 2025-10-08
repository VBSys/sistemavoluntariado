const connection = require("../config/db");
const promiseConn = connection.promise();

exports.cadastrarHabilidades = async (req, res) => {
  const { habilidades } = req.body;
  const id_usuario = parseInt(req.params.id);
  console.log(habilidades, id_usuario);
  if (req.user.id !== id_usuario) {
    return res
      .status(403)
      .json({ erro: "Você só pode editar seu próprio perfil." });
  }

  if (!Array.isArray(habilidades) || habilidades.length > 3) {
    return res.status(400).json({ erro: "Máximo de 3 habilidades permitido." });
  }

  try {
    console.log("Olá");
    const [rows] = await promiseConn.query(
      "SELECT id_usuario FROM usuarios_habilidades WHERE id_usuario = ?",
      [id_usuario]
    );

    console.log(rows);
    console.log("Olá2");
    for (const id_habilidade of habilidades) {
      await promiseConn.query(
        "INSERT INTO usuarios_habilidades (id_usuario, id_habilidade) VALUES (?, ?)",
        [id_usuario, id_habilidade]
      );
    }
    console.log("Olá3");
    res.status(201).json({ mensagem: "Habilidades atualizadas com sucesso." });
  } catch (err) {
    console.error("Erro ao salvar habilidades:", err);
    res.status(500).json({ erro: "Erro ao salvar habilidades." });
  }
};

exports.listarHabilidades = async (req, res) => {
  const id_usuario = parseInt(req.params.id);

  try {
    const [rows] = await promiseConn.query(
      `SELECT h.id_habilidade, h.nome_habilidade
       FROM usuarios_habilidades uh
       JOIN habilidades h ON uh.id_habilidade = h.id_habilidade
       WHERE uh.id_usuario = ?`,
      [id_usuario]
    );

    res.status(200).json({ habilidades: rows });
  } catch (err) {
    console.error("Erro ao buscar habilidades:", err);
    res.status(500).json({ erro: "Erro ao buscar habilidades." });
  }
};
