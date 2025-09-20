const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todos os usuários
 */
router.get("/", userController.listarUsuarios);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Busca usuário por ID
 */
router.get("/:id", userController.buscarUsuarioPorId);

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

module.exports = router;
