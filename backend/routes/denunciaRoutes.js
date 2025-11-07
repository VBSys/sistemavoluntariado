const express = require("express");
const router = express.Router();
const denunciaController = require("../controllers/denunciaController");
const { autenticar } = require("../middlewares/auth");
// Criar denúncia
router.post("/", autenticar, denunciaController.criarDenuncia);
// Listar todas as denúncias
router.get("/", denunciaController.listarDenuncias);

module.exports = router;

///////////////*DOCUMENTANDO AS API'S *///////////
/**
 * @swagger
 * tags:
 *   name: Denúncias
 *   description: Registro e consulta de denúncias
 */

/**
 * @swagger
 * /api/denuncias:
 *   post:
 *     summary: Cria uma nova denúncia
 *     tags: [Denúncias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: integer
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Denúncia registrada com sucesso
 */

/**
 * @swagger
 * /api/denuncias:
 *   get:
 *     summary: Lista todas as denúncias
 *     tags: [Denúncias]
 *     responses:
 *       200:
 *         description: Lista de denúncias
 */
