const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { autenticar } = require("../middlewares/auth");
const verificarAdmin = require("../middlewares/verificarAdmin");

// const denunciaController = require("../controllers/denunciaController");

// Rota para deletar usuário (somente admin)

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todos os usuários
 */

// Debug: retorna payload do token
router.get("/me", autenticar, userController.meToken);

// Listar por tipo (deve vir antes de /:id para não conflitar)

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Busca usuário por ID
 */

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

// NOTE: A rota de exclusão por e-mail foi movida para routes/adminRoutes.js

//HABILIDADES
// Rotas de habilidades/descrição removidas — essas entidades foram descartadas do projeto

module.exports = router;
