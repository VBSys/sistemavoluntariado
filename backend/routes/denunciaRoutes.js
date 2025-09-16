const express = require("express");
const router = express.Router();
const denunciaController = require("../controllers/denunciaController");

// Criar denúncia
router.post("/", denunciaController.criarDenuncia);

// Listar todas as denúncias
router.get("/", denunciaController.listarDenuncias);

module.exports = router;
