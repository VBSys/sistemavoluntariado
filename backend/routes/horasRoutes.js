const express = require("express");
const router = express.Router();
const horasController = require("../controllers/horasController");

// Rotas de horas complementares
router.get("/voluntarios/:id/horas", horasController.totalHorasVoluntario);
router.get("/voluntarios/:id/certificado", horasController.gerarCertificado);

module.exports = router;
