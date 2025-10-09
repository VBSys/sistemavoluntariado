const jwt = require("jsonwebtoken");

// Garante que o JWT_SECRET sempre tenha valor
const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta";
const bcrypt = require("bcrypt");
const db = require("../config/db");

//
// 📌 Listar todos os usuários (com filtro opcional por email)
//

exports.listarUsuarios = (req, res) => {
  const { email } = req.query;
  const { id_tipo } = req.query;
  const { nome_completo } = req.query;

  let sql = `
      SELECT u.id_usuario, u.nome_completo, u.email, u.id_tipo
      FROM usuarios u
    `;
  const params = [];

  if (nome_completo) {
    sql += " WHERE nome_completo = ?";
    params.push(nome_completo);
  }

  if (email) {
    sql += " WHERE email = ?";
    params.push(email);
  }
  if (id_tipo) {
    sql += " WHERE id_tipo = ?";
    params.push(id_tipo);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar usuários" });
    res.json(results);
  });
};

//
// 📌 Buscar usuário por ID
//

exports.buscarUsuarioPorId = (req, res) => {
  const { id } = req.params;

  const sql = `
      SELECT id_usuario, nome_completo, email, id_tipo
      FROM usuarios
      WHERE id_usuario = ?
    `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar usuário" });
    if (results.length === 0)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    res.json(results[0]);
  });
};

//
// 📌 Criar novo usuário (com senha criptografada)
//

exports.criarUsuario = async (req, res) => {
  const { nome_completo, email, senha, id_tipo } = req.body;

  if (!nome_completo || !email || !senha || !id_tipo) {
    return res.status(400).json({
      erro: "Campos obrigatórios ausentes",
      detalhes: "nome_completo, email, senha e id_tipo são obrigatórios",
    });
  }

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const query = `
        INSERT INTO usuarios (nome_completo, email, senha, id_tipo)
        VALUES (?, ?, ?, ?)
      `;

    db.query(
      query,
      [nome_completo, email, senhaCriptografada || null, id_tipo],
      (err, result) => {
        if (err) {
          console.log("ola2");
          console.error("❌ Usuário já existe:", err.message);
          return res.status(500).json({ erro: "Usuário já existe" });
        }

        res.status(201).json({
          mensagem: "Usuário cadastrado com sucesso",
          id_usuario: result.insertId,
        });
      }
    );
  } catch (error) {
    console.error("❌ Erro ao criptografar senha:", error.message);
    res.status(500).json({ erro: "Erro ao criptografar senha" });
  }
};

//
// 📌 Login de usuário (retorna token JWT)
//
exports.loginUsuario = (req, res) => {
  const { email, senha } = req.body;

  db.query(
    "SELECT u.id_usuario, u.nome_completo, u.email, u.senha, u.id_tipo FROM usuarios u WHERE u.email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ erro: err.message });
      if (results.length === 0)
        return res.status(401).json({ erro: "Usuário não encontrado" });

      const usuario = results[0];
      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida)
        return res.status(401).json({ erro: "Senha incorreta" });

      const token = jwt.sign(
        {
          id: usuario.id_usuario,
          id_tipo: usuario.id_tipo,
        },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.json({
        token,
        usuario: {
          id: usuario.id_usuario,
          nome_completo: usuario.nome_completo,
          id_tipo: usuario.id_tipo,
        },
      });
    }
  );
};

//
// 📌 Retornar dados do usuário logado (usando token)
//

// Endpoint de debug: retorna o payload do token para verificar o conteúdo
exports.meToken = (req, res) => {
  if (!req.user) return res.status(401).json({ erro: "Não autenticado" });
  res.json({ tokenPayload: req.user });
};
exports.getUsuarioLogado = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT id_usuario, nome_completo, email, id_tipo FROM usuarios WHERE id_usuario = ?",
    [userId],
    (err, results) => {
      if (err)
        return res.status(500).json({ erro: "Erro ao buscar usuário logado" });
      if (results.length === 0)
        return res.status(404).json({ erro: "Usuário não encontrado" });

      res.json(results[0]);
    }
  );
};

exports.listarPorTipo = (req, res) => {
  const { id_tipo } = req.params;

  const query = `
      SELECT u.id_usuario, u.nome_completo, u.email, u.id_tipo
      FROM usuarios u
      WHERE u.id_tipo = ?
    `;

  db.query(query, [id_tipo], (err, results) => {
    if (err)
      return res.status(500).json({ erro: "Erro ao buscar usuários por tipo" });
    res.json(results);
  });
};

exports.editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome_completo, email, senha, id_tipo } = req.body;

  try {
    // Monta os campos dinamicamente
    const campos = [];
    const valores = [];

    if (nome_completo) {
      campos.push("nome_completo = ?");
      valores.push(nome_completo);
    }

    if (email) {
      campos.push("email = ?");
      valores.push(email);
    }

    if (senha) {
      const senhaCriptografada = await bcrypt.hash(senha, 10);
      campos.push("senha = ?");
      valores.push(senhaCriptografada);
    }

    if (id_tipo) {
      campos.push("id_tipo = ?");
      valores.push(id_tipo);
    }

    if (campos.length === 0) {
      return res.status(400).json({ erro: "Nenhum campo para atualizar" });
    }

    const query = `UPDATE usuarios SET ${campos.join(
      ", "
    )} WHERE id_usuario = ?`;
    valores.push(id);

    db.query(query, valores, (err, result) => {
      if (err) return res.status(500).json({ erro: "Erro ao editar usuário" });
      res.json({ mensagem: "Perfil atualizado com sucesso" });
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao processar edição" });
  }
};
