const express = require("express");
const router = express.Router();
const avaliacaoController = require("../controllers/avaliacaoController");

// POST /avaliacoes - PCD avalia voluntário
router.post("/", avaliacaoController.criarAvaliacao);

// GET /avaliacoes/:id - Ver avaliações de um voluntário
router.get("/:id", avaliacaoController.listarAvaliacoesPorVoluntario);

module.exports = router;
