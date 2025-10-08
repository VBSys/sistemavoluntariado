module.exports = (req, res, next) => {
  if (req.user.id_tipo !== 2) {
    return res.status(403).json({ erro: "Acesso restrito a beneficiários" });
  }
  next();
};
