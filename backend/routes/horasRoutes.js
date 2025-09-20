const express = require("express");
const router = express.Router();
const horasController = require("../controllers/horasController");

// Total de horas de atividades
router.get("/voluntarios/:id/horas", horasController.totalHorasVoluntario);

// Certificado baseado em atividades
router.get("/voluntarios/:id/certificado", horasController.gerarCertificado);

// Total de horas complementares
router.get(
  "/voluntarios/:id/horas-complementares",
  horasController.totalHorasComplementares
);

module.exports = router;

///////////////*DOCUMENTANDO AS API'S *///////////
/**
 * @swagger
 * tags:
 *   name: Horas
 *   description: Registro e consulta de horas voluntárias
 */

/**
 * @swagger
 * /api/horas/voluntarios/{id}/horas:
 *   get:
 *     summary: Total de horas de atividades de um voluntário
 *     tags: [Horas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Total de horas retornado
 */

/**
 * @swagger
 * /api/horas/voluntarios/{id}/certificado:
 *   get:
 *     summary: Gera certificado de horas para o voluntário
 *     tags: [Horas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Certificado gerado
 */

/**
 * @swagger
 * /api/horas/voluntarios/{id}/horas-complementares:
 *   get:
 *     summary: Total de horas complementares de um voluntário
 *     tags: [Horas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Total de horas complementares retornado
 */
