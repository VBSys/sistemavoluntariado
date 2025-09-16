const express = require("express");
const router = express.Router();
const atividadeController = require("../controllers/atividadeController");

// Rotas de atividades
router.post("/", atividadeController.criarAtividade);        // Criar nova
router.get("/", atividadeController.listarAtividades);       // Listar todas
router.get("/:id", atividadeController.buscarAtividadePorId);// Buscar por ID
router.put("/:id", atividadeController.atualizarAtividade);  // Atualizar
router.delete("/:id", atividadeController.removerAtividade); // Remover

module.exports = router;