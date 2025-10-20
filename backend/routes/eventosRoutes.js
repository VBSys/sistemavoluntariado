const express = require("express");
const router = express.Router();
const eventosController = require("../controllers/eventosController");
const { autenticar } = require("../middlewares/auth");

router.post("/", autenticar, eventosController.criarEvento);
router.get("/", eventosController.listarEventos);
router.get("/:id", eventosController.buscarEventoPorId);
router.put("/:id", autenticar, eventosController.atualizarEvento);
router.delete("/:id", autenticar, eventosController.excluirEvento);

module.exports = router;
