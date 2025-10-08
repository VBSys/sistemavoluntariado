const express = require("express");
const router = express.Router();
const { autenticar } = require("../middlewares/auth");
const verificarBeneficiario = require("../middlewares/verificarBeneficiario");

// Exemplo de rota de avaliação ou denúncia
const denunciaController = require("../controllers/denunciaController");

router.post(
  "/denuncias",
  autenticar,
  verificarBeneficiario,
  denunciaController.criarDenuncia
);

module.exports = router;
