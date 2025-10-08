const express = require("express");
const router = express.Router();
const tipoUsuarioController = require("../controllers/tipoUsuarioController");

router.post("/", tipoUsuarioController.criarTipoUsuario);

module.exports = router;
