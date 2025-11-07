const db = require("../config/db");

// Buscar perfil do beneficiário por ID
// Agora o esquema é único: tabela `perfil` contém necessidade_1/2/3
exports.buscarPerfil = async (req, res) => {
  try {
    const id = req.user.id || req.user.id_usuario; // ID do usuário autenticado

    // Busca dados básicos do usuário e colunas do perfil
    const [rows] = await db.promise().query(
      `SELECT u.nome_completo as nome, u.email, p.descricao, p.necessidade_1, p.necessidade_2, p.necessidade_3
         FROM usuarios u
         LEFT JOIN perfil p ON u.id_usuario = p.id_usuario
         WHERE u.id_usuario = ?`,
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ erro: "Beneficiário não encontrado" });
    }

    const perfil = rows[0];
    const necessidades = [
      perfil.necessidade_1,
      perfil.necessidade_2,
      perfil.necessidade_3,
    ]
      .filter((n) => n !== null && n !== undefined && String(n).trim() !== "")
      .map((n) => String(n).trim());

    res.json({
      nome: perfil.nome,
      email: perfil.email,
      descricao: perfil.descricao,
      necessidades,
    });
  } catch (err) {
    console.error("Erro ao buscar perfil:", err);
    res.status(500).json({ erro: "Erro ao buscar perfil" });
  }
};

// Atualizar perfil do beneficiário
// Agora grava em `perfil` (necessidade_1/2/3)
exports.atualizarPerfil = async (req, res) => {
  try {
    const id = req.user.id || req.user.id_usuario;
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

    // Verifica se perfil já existe
    const [perfilRows] = await db
      .promise()
      .query("SELECT id_perfil FROM perfil WHERE id_usuario = ?", [id]);
    const perfilExists = perfilRows && perfilRows.length > 0;

    // Atualiza descrição no perfil; insere se não existir
    if (typeof descricao === "string") {
      if (perfilExists) {
        await db
          .promise()
          .query("UPDATE perfil SET descricao = ? WHERE id_usuario = ?", [
            descricao,
            id,
          ]);
      } else {
        await db
          .promise()
          .query(
            "INSERT INTO perfil (id_usuario, nome, descricao) VALUES (?, ?, ?)",
            [id, nome || null, descricao]
          );
      }
    }

    // Atualiza necessidades (substitui os 3 campos) quando fornecidas
    if (Array.isArray(necessidades)) {
      // normaliza para até 3 entradas
      const n = [null, null, null];
      for (let i = 0; i < Math.min(3, necessidades.length); i++) {
        const v = necessidades[i];
        n[i] = v !== undefined && v !== null ? String(v).trim() : null;
      }

      if (perfilExists) {
        await db
          .promise()
          .query(
            "UPDATE perfil SET necessidade_1 = ?, necessidade_2 = ?, necessidade_3 = ? WHERE id_usuario = ?",
            [n[0], n[1], n[2], id]
          );
      } else {
        // se perfil não existia, criamos com nome/descricao possivelmente nulos e preenchemos necessidades
        await db
          .promise()
          .query(
            "INSERT INTO perfil (id_usuario, nome, descricao, necessidade_1, necessidade_2, necessidade_3) VALUES (?, ?, ?, ?, ?, ?)",
            [id, nome || null, descricao || null, n[0], n[1], n[2]]
          );
      }
    }

    res.json({ mensagem: "Perfil atualizado com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    res.status(500).json({ erro: "Erro ao atualizar perfil" });
  }
};
