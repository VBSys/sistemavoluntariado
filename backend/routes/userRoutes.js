const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { autenticar } = require("../middlewares/auth");
const verificarAdmin = require("../middlewares/verificarAdmin");
const habilidadesController = require("../controllers/habilidadesController");
const descricaoController = require("../controllers/descricaoController");

// const denunciaController = require("../controllers/denunciaController");

// Rota para deletar usuário (somente admin)

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todos os usuários
 */
router.get("/", userController.listarUsuarios);

// Debug: retorna payload do token
router.get("/me", autenticar, userController.meToken);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Busca usuário por ID
 */
router.get("/:id", userController.buscarUsuarioPorId);

router.get("/tipo/:id_tipo", userController.listarPorTipo);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Cria novo usuário
 */
router.post("/", userController.criarUsuario);

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Login de usuário
 */
router.post("/login", userController.loginUsuario);

router.put("/editar/:id", userController.editarUsuario);

//HABILIDADES
router.post(
  "/:id/habilidades",
  autenticar,
  habilidadesController.cadastrarHabilidades
);

router.get("/:id/habilidades", habilidadesController.listarHabilidades);

router.post(
  "/:id/descricao",
  autenticar,
  descricaoController.cadastrarDescricao
);

router.get("/:id/descricao", descricaoController.listarDescricao);

router.put(
  "/:id/habilidades",
  autenticar,
  habilidadesController.editarHabilidades
);

module.exports = router;
