module.exports = (req, res, next) => {
  if (req.user.tipo_usuario !== "voluntario") {
    return res.status(403).json({ erro: "Acesso restrito a voluntários" });
  }
  next();
};
