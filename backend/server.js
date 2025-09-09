const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const db = require("./config/db");

// Rotas
const userRoutes = require("./routes/userRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Prefixo das rotas da API
app.use("/api/usuarios", userRoutes);

// Rota de teste direto no server.js
app.get("/api/teste-conexao", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(results);
  });
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("🟢 Novo usuário conectado");

  socket.on("chat message", ({ userId, username, msg }) => {
    const mensagemFormatada = `${username || "Usuário"}: ${msg}`;
    io.emit("chat message", mensagemFormatada);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Usuário desconectado");
  });
});

// Inicialização do servidor
server.listen(3000, () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
});
