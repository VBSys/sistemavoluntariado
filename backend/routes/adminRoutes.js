const express = require("express");
const router = express.Router();
const { autenticar } = require("../middlewares/auth");
const verificarAdmin = require("../middlewares/verificarAdmin");

// Endpoints de 'atividades' removidos - retornam 410 Gone
router.post("/atividades", autenticar, verificarAdmin, (req, res) => {
  res.status(410).json({ erro: "Recurso 'atividades' removido" });
});
router.put("/atividades/:id", autenticar, verificarAdmin, (req, res) => {
  res.status(410).json({ erro: "Recurso 'atividades' removido" });
});
router.delete("/atividades/:id", autenticar, verificarAdmin, (req, res) => {
  res.status(410).json({ erro: "Recurso 'atividades' removido" });
});
router.get("/atividades", autenticar, verificarAdmin, (req, res) => {
  res.status(410).json({ erro: "Recurso 'atividades' removido" });
});

router.get("/painel", autenticar, verificarAdmin, (req, res) => {
  res.json({ mensagem: "Painel administrativo acessado com sucesso." });
});

module.exports = router;
