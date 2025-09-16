const db = require("../config/db");
const bcrypt = require("bcrypt");

// Listar todos os usuários
exports.listarUsuarios = (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar usuários" });
    res.json(results);
  });
};

// Registrar novo usuário (com validação de perfil e email)
exports.registrarUsuario = async (req, res) => {
  const { nome_completo, email, senha, tipo_usuario, sobre_mim } = req.body;

  if (!["voluntario", "beneficiario"].includes(tipo_usuario)) {
    return res.status(400).json({ erro: "Perfil inválido" });
  }

  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ erro: "Erro ao verificar email" });
      if (results.length > 0) {
        return res.status(400).json({ erro: "Email já cadastrado" });
      }

      try {
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const data_cadastro = new Date();

        const sql = `
          INSERT INTO usuarios 
          (nome_completo, email, senha, tipo_usuario, sobre_mim, data_cadastro) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(
          sql,
          [
            nome_completo,
            email,
            senhaCriptografada,
            tipo_usuario,
            sobre_mim || null,
            data_cadastro,
          ],
          (err, result) => {
            if (err) return res.status(500).json({ erro: "Erro ao criar usuário" });
            res.status(201).json({
              mensagem: "Usuário registrado",
              usuario: {
                id_usuario: result.insertId,
                nome_completo,
                email,
                tipo_usuario,
              },
            });
          }
        );
      } catch (error) {
        res.status(500).json({ erro: "Erro ao criptografar senha" });
      }
    }
  );
};

// Login de usuário
exports.loginUsuario = (req, res) => {
  const { email, senha } = req.body;

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar usuário" });
    if (results.length === 0) return res.status(404).json({ erro: "Usuário não encontrado" });

    const usuario = results[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    res.json({
      mensagem: "Login realizado",
      perfil: usuario.tipo_usuario,
      redirectTo: usuario.tipo_usuario === "voluntario" ? "/voluntario/home" : "/beneficiario/home",
      usuario: {
        id_usuario: usuario.id_usuario,
        nome_completo: usuario.nome_completo,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
      },
    });
  });
};

// Buscar usuário por ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT id_usuario, nome_completo, email, tipo_usuario, sobre_mim, data_cadastro FROM usuarios WHERE id_usuario = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: "Erro ao buscar usuário" });
      if (results.length === 0) return res.status(404).json({ erro: "Usuário não encontrado" });
      res.json(results[0]);
    }
  );
};

// Remover usuário
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM usuarios WHERE id_usuario = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao remover usuário" });
    if (result.affectedRows === 0) return res.status(404).json({ erro: "Usuário não encontrado" });
    res.json({ mensagem: "Usuário removido com sucesso" });
  });
};

// Perfil do usuário por ID
exports.profile = (req, res) => {
  const userId = req.params.id;
  db.query(
    "SELECT id_usuario, nome_completo, email, tipo_usuario, sobre_mim FROM usuarios WHERE id_usuario = ?",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ erro: "Erro ao buscar perfil" });
      if (results.length === 0) return res.status(404).json({ erro: "Usuário não encontrado" });

      const user = results[0];
      res.json({
        id: user.id_usuario,
        nome: user.nome_completo,
        email: user.email,
        perfil: user.tipo_usuario,
        sobre_mim: user.sobre_mim,
      });
    }
  );
};

// Atualizar usuário
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nome_completo, email, senha, tipo_usuario, sobre_mim } = req.body;

  let fields = [];
  let values = [];

  if (nome_completo) {
    fields.push("nome_completo = ?");
    values.push(nome_completo);
  }
  if (email) {
    fields.push("email = ?");
    values.push(email);
  }
  if (senha) {
    try {
      const senhaCriptografada = await bcrypt.hash(senha, 10);
      fields.push("senha = ?");
      values.push(senhaCriptografada);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao criptografar senha" });
    }
  }
  if (tipo_usuario) {
    fields.push("tipo_usuario = ?");
    values.push(tipo_usuario);
  }
  if (sobre_mim) {
    fields.push("sobre_mim = ?");
    values.push(sobre_mim);
  }

  if (fields.length === 0) {
    return res.status(400).json({ erro: "Nenhum campo para atualizar" });
  }

  const sql = `UPDATE usuarios SET ${fields.join(", ")} WHERE id_usuario = ?`;
  values.push(id);

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao atualizar usuário" });
    if (result.affectedRows === 0) return res.status(404).json({ erro: "Usuário não encontrado" });

    // Buscar usuário atualizado
    db.query(
      "SELECT id_usuario, nome_completo, email, tipo_usuario, sobre_mim FROM usuarios WHERE id_usuario = ?",
      [id],
      (err, results) => {
        if (err) return res.status(500).json({ erro: "Erro ao buscar usuário atualizado" });
        res.json(results[0]);
      }
    );
  });
};


