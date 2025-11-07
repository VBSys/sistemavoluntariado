const express = require("express");
const router = express.Router();
const tipoUsuarioController = require("../controllers/tipoUsuarioController");

router.post("/", tipoUsuarioController.create);

module.exports = router;
