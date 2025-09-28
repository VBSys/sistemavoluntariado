module.exports = (req, res, next) => {
  if (req.user.tipo_usuario !== "admin") {
    return res.status(403).json({ erro: "Acesso restrito a administradores" });
  }
  next();
};
