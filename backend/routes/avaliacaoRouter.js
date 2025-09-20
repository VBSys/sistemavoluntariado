const express = require("express");
const router = express.Router();
const avaliacaoController = require("../controllers/avaliacaoController");

// POST /avaliacoes - PCD avalia voluntário
router.post("/", avaliacaoController.criarAvaliacao);

// GET /avaliacoes/:id - Ver avaliações de um voluntário
router.get("/:id", avaliacaoController.listarAvaliacoesPorVoluntario);

module.exports = router;

///////////////*DOCUMENTANDO AS API'S *///////////

/**
 * @swagger
 * tags:
 *   name: Avaliações
 *   description: Avaliações feitas por PCDs sobre voluntários
 */

/**
 * @swagger
 * /api/avaliacoes:
 *   post:
 *     summary: Cria uma nova avaliação
 *     tags: [Avaliações]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_voluntario:
 *                 type: integer
 *               nota:
 *                 type: integer
 *               comentario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Avaliação registrada com sucesso
 */

/**
 * @swagger
 * /api/avaliacoes/{id}:
 *   get:
 *     summary: Lista avaliações de um voluntário
 *     tags: [Avaliações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de avaliações
 */
