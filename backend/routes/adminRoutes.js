const express = require("express");
const router = express.Router();
const { autenticar } = require("../middlewares/auth");
const verificarAdmin = require("../middlewares/verificarAdmin");
const adminController = require("../controllers/adminController");

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

router.get("/tipo/:id_tipo", adminController.listarPorTipo);
// Rotas específicas primeiro
router.get("/consultar", adminController.consultarUsuarios);
router.get("/todos", adminController.buscarTodosUsuarios);

// Excluir usuário por e-mail (apenas admin)
router.delete(
  "/email",
  autenticar,
  verificarAdmin,
  adminController.deletarUsuarioPorEmail
);

// Rota com parâmetro por último
router.delete(
  "/:id",
  autenticar,
  verificarAdmin,
  adminController.deletarUsuario
);

module.exports = router;
