const jwt = require("jsonwebtoken");

// Usa a mesma chave secreta do controller (fallback compatível)
const JWT_SECRET = process.env.JWT_SECRET || "nexassist_jwt_secret_key_2025";

// Middleware de autenticação
function autenticar(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    return res.status(401).json({ erro: "Token ausente" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ erro: "Token inválido" });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ erro: "Token inválido" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // id, id_tipo, etc.
    return next();
  } catch (err) {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}

// Middleware para verificar se o usuário é administrador
function verificarAdmin(req, res, next) {
  const { id_tipo } = req.user || {};

  if (id_tipo !== 3) {
    return res.status(403).json({
      erro: "Acesso negado. Apenas administradores podem realizar esta ação.",
    });
  }

  next();
}

// Exporta tudo corretamente
module.exports = {
  autenticar,
  verificarAdmin,
};
