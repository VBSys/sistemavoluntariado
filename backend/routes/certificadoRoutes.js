const express = require("express");
const router = express.Router();
const certificadoController = require("../controllers/certificadoController");
const { autenticar } = require("../middlewares/auth"); // usa seu auth.js

// Rota protegida — requer login
router.get("/gerar", autenticar, certificadoController.gerarCertificado);

module.exports = router;

