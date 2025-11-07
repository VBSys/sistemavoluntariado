const express = require("express");
const router = express.Router();
const { autenticar } = require("../middlewares/auth");
const chatController = require("../controllers/chatController");

router.get("/conversas", autenticar, chatController.listarConversas);

module.exports = router;
