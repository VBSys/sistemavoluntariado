module.exports = (req, res, next) => {
  if (req.user.tipo_usuario !== "beneficiario") {
    return res.status(403).json({ erro: "Acesso restrito a beneficiários" });
  }
  next();
};
