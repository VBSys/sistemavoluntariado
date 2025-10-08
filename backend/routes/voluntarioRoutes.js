const express = require("express");
const router = express.Router();
const { autenticar } = require("../middlewares/auth");
const verificarVoluntario = require("../middlewares/verificarVoluntario");
const horasController = require("../controllers/horasController");

router.post(
  "/horas",
  autenticar,
  verificarVoluntario,
  horasController.registrarHorasComplementares
);
router.get(
  "/horas/:id",
  autenticar,
  verificarVoluntario,
  horasController.totalHorasVoluntario
);
router.get(
  "/certificado/:id",
  autenticar,
  verificarVoluntario,
  horasController.gerarCertificado
);
router.get(
  "/horas-complementares/:id",
  autenticar,
  verificarVoluntario,
  horasController.totalHorasComplementares
);

module.exports = router;
