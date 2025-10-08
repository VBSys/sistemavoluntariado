// 📁 routes/atividadeRoutes.js
const express = require("express");
const router = express.Router();
// Atividades removidas: tabela não existe mais. Retornamos 410 Gone para todas as rotas.
router.use((req, res) => {
  res.status(410).json({ erro: "Recursos de atividades removidos" });
});

module.exports = router;

///////////////*DOCUMENTANDO AS API'S *///////////

/**
 * @swagger
 * tags:
 *   name: Atividades
 *   description: Gerenciamento de atividades voluntárias
 */

/**
 * @swagger
 * /api/atividades:
 *   post:
 *     summary: Cria uma nova atividade
 *     tags: [Atividades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               data:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Atividade criada com sucesso
 */

/**
 * @swagger
 * /api/atividades:
 *   get:
 *     summary: Lista todas as atividades
 *     tags: [Atividades]
 *     responses:
 *       200:
 *         description: Lista de atividades
 */

/**
 * @swagger
 * /api/atividades/{id}:
 *   get:
 *     summary: Busca uma atividade pelo ID
 *     tags: [Atividades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Atividade encontrada
 *       404:
 *         description: Atividade não encontrada
 */

/**
 * @swagger
 * /api/atividades/{id}:
 *   put:
 *     summary: Atualiza uma atividade existente
 *     tags: [Atividades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               data:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Atividade atualizada com sucesso
 */

/**
 * @swagger
 * /api/atividades/{id}:
 *   delete:
 *     summary: Remove uma atividade
 *     tags: [Atividades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Atividade removida com sucesso
 */
