const express = require("express");
const router = express.Router();
const perfilController = require("../controllers/perfilController");
const { autenticar } = require("../middlewares/auth");

// Criar perfil: requer autenticação (usa id do token quando não informado no body)
router.post("/", autenticar, perfilController.criarPerfil);
router.get("/:id_usuario", perfilController.buscarPerfilPorUsuario);

module.exports = router;
