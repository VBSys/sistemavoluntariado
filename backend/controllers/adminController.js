const db = require("../config/db");

exports.deletarUsuario = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM usuarios WHERE id_usuario = ?";

  db.query(query, [id], (err, resultado) => {
    if (err) {
      console.error("❌ Erro ao deletar usuário:", err.message);
      return res.status(500).json({ erro: "Erro ao deletar usuário" });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json({ mensagem: "Usuário deletado com sucesso" });
  });
};
