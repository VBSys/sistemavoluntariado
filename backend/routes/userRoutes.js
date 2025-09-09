// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao buscar usuários" });
    }
    res.json(results);
  });
});

module.exports = router;
