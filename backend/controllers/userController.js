const db = require("../config/db");
const bcrypt = require("bcrypt");

// Listar todos os usuários
exports.listarUsuarios = (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar usuários" });
    res.json(results);
  });
};

// Criar novo usuário
exports.criarUsuario = async (req, res) => {
  const { nome_completo, email, senha, tipo_usuario, sobre_mim } = req.body;

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
        sobre_mim,
        data_cadastro,
      ],
      (err, result) => {
        if (err) return res.status(500).json({ erro: "Erro ao criar usuário" });
        res.status(201).json({ id_usuario: result.insertId });
      }
    );
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criptografar senha" });
  }
};

// Login de usuário
exports.loginUsuario = (req, res) => {
  const { email, senha } = req.body;

  const sql = "SELECT * FROM usuarios WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar usuário" });
    if (results.length === 0)
      return res.status(401).json({ erro: "Usuário não encontrado" });

    const usuario = results[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    res.json({ mensagem: "Login bem-sucedido", usuario });
  });
};
