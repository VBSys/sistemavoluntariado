const express = require("express");
const router = express.Router();
const perfilController = require("../controllers/perfilController");

router.post("/", perfilController.criarPerfil);
router.get("/:id_usuario", perfilController.buscarPerfilPorUsuario);

module.exports = router;
