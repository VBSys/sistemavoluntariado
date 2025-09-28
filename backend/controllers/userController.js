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

  let sql = `
    SELECT id_usuario, nome_completo, email, tipo_usuario, sobre_mim
    FROM usuarios
  `;
  const params = [];

  if (email) {
    sql += " WHERE email = ?";
    params.push(email);
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
    SELECT id_usuario, nome_completo, email, tipo_usuario, sobre_mim
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
  const { nome_completo, email, senha, tipo_usuario, sobre_mim } = req.body;

  if (!nome_completo || !email || !senha || !tipo_usuario) {
    return res.status(400).json({
      erro: "Campos obrigatórios ausentes",
      detalhes: "nome_completo, email, senha e tipo_usuario são obrigatórios",
    });
  }

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const query = `
      INSERT INTO usuarios (nome_completo, email, senha, tipo_usuario, sobre_mim)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        nome_completo,
        email,
        senhaCriptografada,
        tipo_usuario,
        sobre_mim || null,
      ],
      (err, result) => {
        if (err) {
          console.error("❌ Erro ao criar usuário:", err.message);
          return res.status(500).json({ erro: "Erro ao criar usuário" });
        }

        res.status(201).json({
          mensagem: "Usuário cadastrado com sucesso",
          id: result.insertId,
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
    "SELECT * FROM usuarios WHERE email = ?",
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
          tipo_usuario: usuario.tipo_usuario,
        },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.json({
        token,
        usuario: {
          id: usuario.id_usuario,
          nome_completo: usuario.nome_completo,
          tipo_usuario: usuario.tipo_usuario,
        },
      });
    }
  );
};

//
// 📌 Retornar dados do usuário logado (usando token)
//
exports.getUsuarioLogado = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT id_usuario, nome_completo, email, tipo_usuario, sobre_mim FROM usuarios WHERE id_usuario = ?",
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
