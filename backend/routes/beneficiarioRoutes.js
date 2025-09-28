const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const verificarBeneficiario = require("../middlewares/verificarBeneficiario");

// Exemplo de rota de avaliação ou denúncia
const denunciaController = require("../controllers/denunciaController");

router.post(
  "/denuncias",
  auth,
  verificarBeneficiario,
  denunciaController.criarDenuncia
);

module.exports = router;
