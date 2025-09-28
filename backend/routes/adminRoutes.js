const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const verificarAdmin = require("../middlewares/verificarAdmin");
const atividadeController = require("../controllers/atividadeController");

router.post(
  "/atividades",
  auth,
  verificarAdmin,
  atividadeController.criarAtividade
);
router.put(
  "/atividades/:id",
  auth,
  verificarAdmin,
  atividadeController.atualizarAtividade
);
router.delete(
  "/atividades/:id",
  auth,
  verificarAdmin,
  atividadeController.removerAtividade
);
router.get(
  "/atividades",
  auth,
  verificarAdmin,

  listarAtividades
);
module.exports = router;
