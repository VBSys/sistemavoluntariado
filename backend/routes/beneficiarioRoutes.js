const express = require("express");
const router = express.Router();
const { autenticar } = require("../middlewares/auth");
const verificarBeneficiario = require("../middlewares/verificarBeneficiario");
const beneficiarioController = require("../controllers/beneficiarioController");

// Rota para buscar perfil do beneficiário
router.get(
  "/perfil",
  autenticar,
  verificarBeneficiario,
  beneficiarioController.buscarPerfil
);

// Rota para atualizar perfil do beneficiário
router.put(
  "/perfil",
  autenticar,
  verificarBeneficiario,
  beneficiarioController.atualizarPerfil
);

// Outras rotas
const denunciaController = require("../controllers/denunciaController");

router.post(
  "/denuncias",
  autenticar,
  verificarBeneficiario,
  denunciaController.criarDenuncia
);

module.exports = router;
