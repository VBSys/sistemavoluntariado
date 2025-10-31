const db = require("../config/db");

// Buscar perfil do beneficiário por ID
exports.buscarPerfil = async (req, res) => {
  try {
    const id = req.user.id; // ID do usuário autenticado

    // Busca dados básicos do usuário e descrição no perfil
    const [rows] = await db.promise().query(
      `SELECT u.nome_completo as nome, u.email, p.descricao 
         FROM usuarios u 
         LEFT JOIN perfil_beneficiario p ON u.id_usuario = p.id_usuario
         WHERE u.id_usuario = ?`,
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ erro: "Beneficiário não encontrado" });
    }

    // Busca as necessidades do beneficiário no novo esquema (perfil_beneficiario)
    const [necessidades] = await db.promise().query(
      `SELECT h.nome_habilidade as necessidade
       FROM perfil_beneficiario p
       JOIN habilidades h ON p.id_necessidade = h.id_habilidade
       WHERE p.id_usuario = ?`,
      [id]
    );

    res.json({
      ...rows[0],
      necessidades: necessidades.map((n) => n.necessidade),
    });
  } catch (err) {
    console.error("Erro ao buscar perfil:", err);
    res.status(500).json({ erro: "Erro ao buscar perfil" });
  }
};

// Atualizar perfil do beneficiário
exports.atualizarPerfil = async (req, res) => {
  try {
    const id = req.user.id;
    const { nome, descricao, necessidades } = req.body;

    // Atualiza dados básicos do usuário
    if (nome) {
      await db
        .promise()
        .query("UPDATE usuarios SET nome_completo = ? WHERE id_usuario = ?", [
          nome,
          id,
        ]);
    }

    // Atualiza descrição no perfil_beneficiario
    if (typeof descricao === "string") {
      // Tenta update; se não existir, insere uma linha com id_necessidade NULL
      const [updateResult] = await db
        .promise()
        .query(
          "UPDATE perfil_beneficiario SET descricao = ? WHERE id_usuario = ?",
          [descricao, id]
        );

      if (updateResult.affectedRows === 0) {
        await db
          .promise()
          .query(
            "INSERT INTO perfil_beneficiario (id_usuario, descricao, id_necessidade) VALUES (?, ?, NULL)",
            [id, descricao]
          );
      }
    }

    // Se houver novas necessidades, atualiza (substitui)
    if (necessidades && necessidades.length > 0) {
      // Remove registros antigos na tabela de perfil
      await db
        .promise()
        .query("DELETE FROM perfil_beneficiario WHERE id_usuario = ?", [id]);

      // Insere novas necessidades; aceita id ou nome da habilidade
      for (const necessidade of necessidades) {
        let id_habilidade = null;
        if (typeof necessidade === "number") {
          id_habilidade = necessidade;
        } else {
          const [hrows] = await db
            .promise()
            .query(
              "SELECT id_habilidade FROM habilidades WHERE nome_habilidade = ? LIMIT 1",
              [necessidade]
            );
          if (hrows && hrows[0]) id_habilidade = hrows[0].id_habilidade;
        }

        if (id_habilidade) {
          await db
            .promise()
            .query(
              "INSERT INTO perfil_beneficiario (id_usuario, descricao, id_necessidade) VALUES (?, NULL, ?)",
              [id, id_habilidade]
            );
        }
      }
    }

    res.json({ mensagem: "Perfil atualizado com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    res.status(500).json({ erro: "Erro ao atualizar perfil" });
  }
};
