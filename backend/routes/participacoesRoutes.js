const express = require("express");
const router = express.Router();
const participacoesController = require("../controllers/participacoesController");
const { autenticar } = require("../middlewares/auth");

router.post("/", autenticar, participacoesController.criarParticipacao);
router.get("/", participacoesController.listarParticipacoes);
router.get("/evento/:id_evento", participacoesController.listarPorEvento);
router.put("/:id", autenticar, participacoesController.atualizarStatus);
router.delete("/:id", autenticar, participacoesController.excluirParticipacao);

module.exports = router;
