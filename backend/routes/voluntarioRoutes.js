const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const verificarVoluntario = require("../middlewares/verificarVoluntario");
const horasController = require("../controllers/horasController");

router.post(
  "/horas",
  auth,
  verificarVoluntario,
  horasController.registrarHorasComplementares
);
router.get(
  "/horas/:id",
  auth,
  verificarVoluntario,
  horasController.totalHorasVoluntario
);
router.get(
  "/certificado/:id",
  auth,
  verificarVoluntario,
  horasController.gerarCertificado
);
router.get(
  "/horas-complementares/:id",
  auth,
  verificarVoluntario,
  horasController.totalHorasComplementares
);

module.exports = router;
